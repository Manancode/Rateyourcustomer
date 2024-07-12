"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

export interface TabInfo {
  label: string;
  content: React.ReactNode;
}

interface LabTabsProps {
  tabs: TabInfo[];
}

export default function LabTabs({ tabs }: LabTabsProps) {
  const [value, setValue] = React.useState('0');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} value={index.toString()} />
            ))}
          </TabList>
        </Box>
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={index.toString()}>
            {tab.content}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
}
