import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';

const GitHubDataSkeleton = () => {
  const MetricCardSkeleton = () => (
    <Box sx={{ 
      flex: 1,
      p: 2, 
      backgroundColor: 'rgba(255, 255, 255, 0.03)', 
      borderRadius: 1,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
        <Skeleton 
          variant="circular" 
          width={16} 
          height={16}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <Skeleton 
          variant="text" 
          width={60} 
          height={16}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
      </Box>
      <Skeleton 
        variant="text" 
        width={80} 
        height={24}
        sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.1)',
          transform: 'scale(1)',
          borderRadius: 1
        }} 
      />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Skeleton 
          variant="circular" 
          width={20} 
          height={20}
          sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
        />
        <Typography variant="body2" sx={{ color: '#ccc' }}>
          Loading GitHub data...
        </Typography>
      </Box>
      
      {/* First Row */}
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </Box>

      {/* Second Row */}
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </Box>

      {/* Third Row */}
      <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </Box>
      
      {/* Languages skeleton */}
      <Box sx={{ mt: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Skeleton 
            variant="circular" 
            width={16} 
            height={16}
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            Analyzing languages...
          </Typography>
        </Box>
        
        {/* Language bar skeletons */}
        {[1, 2, 3].map((index) => (
          <Box key={index} sx={{ mb: 1.5 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 0.5 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Skeleton 
                  variant="circular" 
                  width={12} 
                  height={12}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                />
                <Skeleton 
                  variant="text" 
                  width={80} 
                  height={16}
                  sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
                />
              </Box>
              <Skeleton 
                variant="text" 
                width={40} 
                height={16}
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}
              />
            </Box>
            
            {/* Progress bar skeleton */}
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height={8}
              sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                transform: 'scale(1)'
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GitHubDataSkeleton; 