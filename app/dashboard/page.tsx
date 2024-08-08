
import Navbar from '../components/navbar';
import LabTabs from '../components/tabs';


function Dashboard() {
    const tabs = [
        { label: 'Overview', content: <div>Overview content</div> },
        { label: 'Customer Insights', content: <div>Customer Insights content</div> },
        { label: 'Activity Reports', content: <div>Activity Reports content</div> },
        { label: 'Revenue Reports', content: <div>Revenue Reports content</div> },
        { label: 'Settings', content: <div>Settings content</div> },
    ];

return(
    <><Navbar />
    <div className="main-content">
        <LabTabs tabs={tabs} />
    </div></>
)

}
export default Dashboard