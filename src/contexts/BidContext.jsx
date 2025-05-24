import React, { createContext, useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';

const BidContext = createContext(undefined);

export const useBids = () => {
    const context = useContext(BidContext);
    if (context === undefined) {
        throw new Error('useBids must be used within a BidProvider');
    }
    return context;
};

export const BidProvider = ({ children }) => {
    const { user } = useAuth();
    const [userBidsData, setUserBidsData] = useState({ taskIds: new Set(), count: 0 });
    const [loadingBids, setLoadingBids] = useState(true);

    const fetchUserBidSummary = useCallback(async (currentUserId) => {
        if (!currentUserId) {
            setUserBidsData({ taskIds: new Set(), count: 0 });
            setLoadingBids(false);
            return;
        }
        setLoadingBids(true);
        try {
            const response = await fetch(`http://localhost:5000/bids/user/${currentUserId}/summary`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch bid summary');
            }
            const data = await response.json();
            setUserBidsData({
                taskIds: new Set(data.bidTaskIds || []),
                count: data.count || 0,
            });
        } catch (error) {
            console.error("Error fetching user bid summary:", error);
            setUserBidsData({ taskIds: new Set(), count: 0 });
        } finally {
            setLoadingBids(false);
        }
    }, []); 

    useEffect(() => {
        if (user && user.uid) {
            fetchUserBidSummary(user.uid);
        } else {
            setUserBidsData({ taskIds: new Set(), count: 0 });
            setLoadingBids(false);
        }
    }, [user, fetchUserBidSummary]);

    const addBid = useCallback(async (taskId) => { 
        if (!user) {
            console.error("User must be logged in to place a bid.");
            throw new Error("User not authenticated.");
        }
        try {
            const response = await fetch('http://localhost:5000/bids', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    taskId,
                    userId: user.uid,
                    bidderEmail: user.email,
                    bidderName: user.displayName || 'Anonymous Bidder',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 409) {
                    if (!userBidsData.taskIds.has(taskId)) {
                         setUserBidsData(prev => ({
                            taskIds: new Set(prev.taskIds).add(taskId),
                            count: prev.taskIds.has(taskId) ? prev.count : prev.count + 1,
                        }));
                    }
                }
                throw new Error(errorData.message || 'Failed to place bid');
            }
            
            setUserBidsData(prev => ({
                taskIds: new Set(prev.taskIds).add(taskId),
                count: prev.taskIds.has(taskId) ? prev.count : prev.count + 1,
            }));
            return true;
        } catch (error) {
            console.error("Error placing bid:", error);
            if (error.message.includes("already placed a bid")) {
                 if (user && user.uid) fetchUserBidSummary(user.uid);
            }
            throw error;
        }
    }, [user, userBidsData.taskIds, fetchUserBidSummary]); 

    const hasBid = useCallback((taskId) => { 
        return userBidsData.taskIds.has(taskId);
    }, [userBidsData.taskIds]);

    const totalBidOpportunities = userBidsData.count;

    
    const memoizedRefreshBids = useCallback(() => {
        if (user && user.uid) {
            fetchUserBidSummary(user.uid);
        }
    }, [user, fetchUserBidSummary]);

    
    const value = useMemo(() => ({
        addBid,
        hasBid,
        totalBidOpportunities,
        loadingBids,
        refreshBids: memoizedRefreshBids, 
    }), [addBid, hasBid, totalBidOpportunities, loadingBids, memoizedRefreshBids]);

    return <BidContext.Provider value={value}>{children}</BidContext.Provider>;
};