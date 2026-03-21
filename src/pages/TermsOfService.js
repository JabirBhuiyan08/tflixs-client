import React, { useState, useEffect } from 'react';
import SEOHead from '../components/layout/SEOHead';
import api from '../utils/api';

const TermsOfService = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/pages/terms-of-service')
      .then(res => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(err => console.error('Error fetching terms of service:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SEOHead page="terms-of-service" title="Terms of Service – Tflixs" />

      <section className="page-hero">
        <div className="container">
          <h1>{data?.metaTitle || 'Terms of Service'}</h1>
          <p>Welcome to Tflixs!</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="content-block">
            {loading ? (
              <div className="loading">Loading...</div>
            ) : (
              <>
                <p>
                  By accessing this website, we assume you accept these terms and conditions. 
                  Do not continue to use Tflixs if you do not agree to take all of the terms and conditions stated on this page.
                </p>

                <h2>1. Use of the Calculator</h2>
                <p>
                  The Smart Fertilizer Calculator for Better Harvests is provided for educational and informational purposes only. 
                  While we strive for 100% mathematical accuracy, Tflixs is not responsible for any crop damage, financial loss, 
                  or environmental issues resulting from the use of our calculations. Users are encouraged to verify results 
                  with a local agricultural professional.
                </p>

                <h2>2. Intellectual Property</h2>
                <p>
                  Unless otherwise stated, Tflixs and/or its licensors own the intellectual property rights for all material on Tflixs. 
                  All intellectual property rights are reserved. You may access this from Tflixs for your own personal use 
                  subjected to restrictions set in these terms and conditions.
                </p>

                <h2>3. User Restrictions</h2>
                <p>
                  You are specifically restricted from all of the following:
                </p>
                <ul>
                  <li>Selling, sublicensing, or commercializing any website material;</li>
                  <li>Using this website in any way that is or may be damaging to this website;</li>
                  <li>Using this website contrary to applicable laws and regulations.</li>
                </ul>

                <h2>4. Disclaimer</h2>
                <p>
                  This website is provided "as is," with all faults, and Tflixs expresses no representations or warranties, 
                  of any kind related to this website or the materials contained on this website.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
