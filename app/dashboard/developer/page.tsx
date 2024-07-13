import React from 'react';
import LabTabs from '@/app/components/tabs';
import dynamic from 'next/dynamic';

const Overview = dynamic(() => import('../developer/tabs/overview'));
const ApiKeys = dynamic(() => import('../developer/tabs/apikey'));

export default function Developerpage() {
    const tabs = [
        { label: 'Overview', content: <Overview /> },
        { label: 'Api keys', content: <ApiKeys/> },
        { label: 'Webhooks', content: <div>Activity Reports content</div> },
        { label: 'Events', content: <div>Revenue Reports content</div> },
        { label: 'Logs', content: <div>Settings content</div> },
    ];

    return (
        <div className="main-content">
            <LabTabs tabs={tabs} />
        </div>
    );
}
