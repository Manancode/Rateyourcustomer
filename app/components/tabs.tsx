"use client";

import React from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

function TabPanel(props: { [x: string]: any; children: any; value: any; index: any; }) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

interface SimpleTabsProps {
    tabs: { label: string, content: React.ReactNode }[];
}

export default function SimpleTabs({ tabs }: SimpleTabsProps) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    return (
        <div>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                {tabs.map((tab, index) => (
                    <Tab label={tab.label} {...a11yProps(index)} key={index} />
                ))}
            </Tabs>
            {tabs.map((tab, index) => (
                <TabPanel value={value} index={index} key={index}>
                    {tab.content}
                </TabPanel>
            ))}
        </div>
    );
}
