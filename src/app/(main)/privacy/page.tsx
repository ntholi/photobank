import React from 'react';
import { NextPage } from 'next';

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy for Lehakoe.org.ls</h1>
      <p className="text-sm text-gray-600 mb-8">Last updated: 30/07/2024</p>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p>Welcome to Lehakoe.org.ls ("we", "our", or "us"), a photobank website operated by the Lesotho Tourism Development Sector (LTDS). This Privacy Policy is designed to help you understand how we collect, use, share, and protect your personal information when you use our website and services.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
        <p>We collect information you provide (such as account information, profile details, and uploaded content) and information automatically collected (such as device information and usage data).</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
        <p>We use the collected information to provide and maintain our services, manage your account, showcase and potentially sell photographs, improve our website, communicate with you, and comply with legal obligations.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
        <p>We may share your information with your consent, with service providers, in connection with photo sales, to comply with legal obligations, or in the event of a business transfer.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Your Rights and Choices</h2>
        <p>You have the right to access and update your account information, request deletion of your data, opt-out of marketing communications, and choose whether to make your uploaded photographs public or private.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Data Security</h2>
        <p>We implement appropriate technical and organizational measures to protect your personal information, but no method of transmission over the Internet is 100% secure.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Children's Privacy</h2>
        <p>Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or our practices, please contact us at: [Insert LTDS contact information]</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;