import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faBatteryThreeQuarters, faCar, faPlug, faBars, faCog, faSolarPanel, faInfoCircle, faWifi   } from '@fortawesome/free-solid-svg-icons';

import './App.css';

function App() {
  const [alldata, setAlldata] = useState([]);
  const [solarPower, setSolarPower] = useState(0);
  const [loadPower, setLoadPower] = useState(0);
  const [batteryPower, setBatteryPower] = useState(0);
  const [evPower, setEvPower] = useState(0);

  useEffect(()=> {
    fetchData();
  }, []);

  // Fetch data function
  async function fetchData() {
    try {
      const data = await getData();
      setAlldata(data);

      const solarItem = data.find(item => item.name === 'Solar');

      // Find each power
      if (solarItem && typeof solarItem.power === 'number') {
        setSolarPower(solarItem.power);
      } else {
        setSolarPower(0);
      }

      const loadItem = data.find(item => item.name === 'Load');

      if (loadItem && typeof loadItem.power === 'number') {
        setLoadPower(loadItem.power);
      } else {
        setLoadPower(0);
      }

      const batteryItem = data.find(item => item.name === 'Battery');

      if (batteryItem && typeof batteryItem.power === 'number') {
        setBatteryPower(batteryItem.power);
      } else {
        setBatteryPower(0);
      }

      const evItem = data.find(item => item.name === 'EV');

      if (evItem && typeof evItem.power === 'number') {
        setEvPower(evItem.power);
      } else {
        setEvPower(0);
      }

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

  // Fetch data from API
  async function getData() {
    const getURL = "http://localhost:7000/api/getdata";
    const res = await fetch(getURL);
    return await res.json();
  }

  function calculateTotal(data) {
    const solarItem = data.find(item => item.name === 'Solar');
    
    if (!solarItem || typeof solarItem.power !== 'number') {
        return 0;
    }
    
    const consumptionData = data.filter(item => item.name !== 'Solar');
    
    const totalConsumption = consumptionData.reduce((total, item) => {
        if (typeof item.power === 'number') {
            return total + item.power;
        }
        return total;
    }, 0);
    
    const totalSolarPower = solarItem.power - totalConsumption;
    
    return totalSolarPower;
  }

  // Function to format datetime
  function formatDateTime(datetime) {
    const datePart = datetime.slice(0, 10); 
    const timePart = datetime.slice(10, 15); 

    const formattedDateTime = `${timePart} ${datePart}`;
    return formattedDateTime;
  }

  // Get datetime value
  const datetime = alldata.length > 0 ? alldata[0].datetime : '';

  return (
    <div className='main'>
      <div className='top' style={{ marginLeft: 'auto' }}>
        {formatDateTime(datetime)}
        <div className='wifi'><FontAwesomeIcon icon={faWifi } className="icon" /></div>
      </div> 

      <div className='power'>
        <div className='solar pulsating'>
          <div className='icons'>
            <FontAwesomeIcon icon={faSolarPanel} className="icon" />
            <FontAwesomeIcon icon={faSun} className="solaricon" />
          </div>
          <p className='solarpower'>{solarPower} kW</p>
        </div>
        <div className="arrowicon">
            <strong><span>&gt;&gt;&gt;</span></strong>
        </div>
        <div className='load'>
          <FontAwesomeIcon icon={faPlug} className="loadicon" />
          <p className='otherpower'>{loadPower} kW</p>
        </div>
        <div className="arrowicon">
            <strong><span>- - -</span></strong>
        </div>
        <div className='battery'>
          <FontAwesomeIcon icon={faBatteryThreeQuarters} className="batteryicon" />
          <p className='otherpower'>{batteryPower} kW</p>
        </div>
        <div className="arrowicon">
          <strong><span>- - -</span></strong>
        </div>
        <div className='ev'>
          <FontAwesomeIcon icon={faCar} className="evicon" />
          <p className='otherpower'>{evPower} kW</p>
        </div>
      </div>
      <div className='total'>
        Current Total Power is <span className='totalnum'>{calculateTotal(alldata)} kW.</span>
      </div>
      <div className='menu'>
          <button><FontAwesomeIcon icon={faBars} /> MENU</button>
          <button><FontAwesomeIcon icon={faInfoCircle} /> DETAIL</button>
          <button> <FontAwesomeIcon icon={faCog} /> SETTING</button>  
      </div>
    </div>
  )
}

export default App
