import React, { useState, useEffect } from 'react';
import SEOHead from '../components/layout/SEOHead';
import api from '../utils/api';

const PrivacyPolicy = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/pages/privacy-policy')
      .then(res => {
        if (res.data.success) {
          setData(res.data);
        }
      })
      .catch(err => console.error('Error fetching privacy policy:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <SEOHead page="privacy-policy" title="Privacy Policy – Tflixs" />

      <section className="page-hero">
        <div className="container">
          <h1>{data?.metaTitle || 'Privacy Policy'}</h1>
          <p>Last Updated: March 18, 2026</p>
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
                  At Tflixs, accessible from https://tflixs.com/, one of our main priorities is the privacy of our visitors. 
                  This Privacy Policy document contains types of information that is collected and recorded by Tflixs and how we use it.
                </p>

                <h2>1. Information We Collect</h2>
                <p>
                  The Smart Fertilizer Calculator for Better Harvests is designed to function without requiring user registration. 
                  We do not collect personal identification information (PII) such as your name, address, or phone number unless 
                  you voluntarily provide it via our Contact Form.
                </p>

                <h2>2. Log Files</h2>
                <p>
                  Tflixs follows a standard procedure of using log files. These files log visitors when they visit websites. 
                  The information collected by log files includes internet protocol (IP) addresses, browser type, Internet 
                  Service Provider (ISP), date and time stamp, and referring/exit pages.
                </p>

                <h2>3. Cookies and Web Beacons</h2>
                <p>
                  Like any other website, Tflixs uses 'cookies'. These cookies are used to store information including 
                  visitors' preferences, and the pages on the website that the visitor accessed or visited. The information 
                  is used to optimize the users' experience by customizing our web page content based on visitors' browser 
                  type and/or other information.
                </p>

                <h2>4. Third Party Privacy Policies</h2>
                <p>
                  Tflixs's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to 
                  consult the respective Privacy Policies of these third-party ad servers for more detailed information.
                </p>

                <h2>5. Consent</h2>
                <p>
                  By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
