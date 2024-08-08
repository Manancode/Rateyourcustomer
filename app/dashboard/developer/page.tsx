import React from 'react';
import LabTabs from '@/app/components/tabs';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ApiKeysPage from '../developer/tabs/apikey';

const Overview = dynamic(() => import('../developer/tabs/overview'));
const Logs = dynamic(() => import('../developer/tabs/logs'));
const Webhooks = dynamic(() => import('../developer/tabs/webhooks'));
const Events = dynamic(() => import('../developer/tabs/events'));

const ApiKeys = dynamic(() => import('../developer/tabs/apikey'));

export default function Developerpage() {
    const tabs = [
        { label: 'Overview', content: <Overview /> },
        { label: 'Api keys', content: <ApiKeysPage/> },
        { label: 'Webhooks', content: <Webhooks/> },
        { label: 'Events', content: <Events/> },
        { label: 'Logs', content: <Logs/> },
    ];

    return (
        <><Link href={"/dashboard/developer"}>
            <h1 className='font-bold text-2xl text-primary'>Developer</h1>
        </Link>
        <div className="main-content">
                <LabTabs tabs={tabs} />
            </div>
            </>
    );
}
