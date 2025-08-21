import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from '@mui/material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '📋 タスク管理', icon: '📋' },
    { path: '/statistics', label: '📊 統計・分析', icon: '📊' },
    { path: '/settings', label: '⚙️ 設定', icon: '⚙️' },
  ];

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: 'white',
        color: '#1f2937',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* ロゴ・タイトル */}
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              color: '#3b82f6',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            ✅ TodoApp
          </Typography>

          {/* ナビゲーションメニュー */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  textTransform: 'none',
                  fontWeight: '600',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: location.pathname === item.path ? 'white' : '#6b7280',
                  backgroundColor: location.pathname === item.path ? '#3b82f6' : 'transparent',
                  '&:hover': {
                    backgroundColor: location.pathname === item.path ? '#2563eb' : '#f3f4f6',
                    color: location.pathname === item.path ? 'white' : '#1f2937',
                  }
                }}
              >
                <span style={{ marginRight: '8px' }}>{item.icon}</span>
                {item.label.replace(/^[^\s]+ /, '')}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;