import React, { useState } from 'react';
import { FiFileText, FiCheckCircle, FiInfo, FiUsers, FiHome, FiShield } from 'react-icons/fi';

const generalInfo = [
  ['NAME OF THE SCHOOL', 'ARMY PUBLIC SCHOOL KHADAKWASLA'],
  ['AFFILIATION NO. (IF APPLICABLE)', '1180026'],
  ['SCHOOL CODE (IF APPLICABLE)', '34114'],
  ['COMPLETE ADDRESS WITH PIN CODE', 'Barrack No. 03, Opp Gole Market, NDA Khadakwasla, Pune - 411023'],
  ['PRINCIPAL NAME & QUALIFICATION', 'Dr. Yasmin Kaur (BSc, MSc Organic Chemistry, B.Ed, PGDEA)'],
  ['SCHOOL EMAIL ID', 'apskhadakwasla1@gmail.com'],
  ['CONTACT DETAILS (LANDLINE/MOBILE)', '020-25290084']
];

const documents = [
  { name: 'COPIES OF AFFILIATION / UPGRADATION LETTER AND RECENT EXTENSION', status: 'Available' },
  { name: 'COPIES OF SOCIETIES / TRUST / COMPANY REGISTRATION / RENEWAL CERTIFICATE', status: 'Available' },
  { name: 'COPY OF NO OBJECTION CERTIFICATE (NOC) ISSUED BY STATE GOVT.', status: 'Available' },
  { name: 'COPIES OF RECOGNITION CERTIFICATE UNDER RTE ACT, 2009', status: 'Available' },
  { name: 'COPY OF VALID BUILDING SAFETY CERTIFICATE AS PER NATIONAL BUILDING CODE', status: 'Available' },
  { name: 'COPY OF VALID FIRE SAFETY CERTIFICATE ISSUED BY COMPETENT AUTHORITY', status: 'Available' },
  { name: 'COPY OF THE DEO CERTIFICATE SUBMITTED BY SCHOOL FOR AFFILIATION', status: 'Available' },
  { name: 'COPIES OF VALID WATER, HEALTH AND SANITATION CERTIFICATES', status: 'Available' }
];

const staffInfo = [
  ['PRINCIPAL', 'Dr. Yasmin Kaur'],
  ['TOTAL NO. OF TEACHERS', '70'],
  ['PGT', '13'],
  ['TGT', '18'],
  ['PRT', '29'],
  ['PRE-PRIMARY / ACTIVITY', '11'],
  ['TEACHERS SECTION RATIO', '1:1.5'],
  ['DETAILS OF SPECIAL EDUCATOR', 'Miss. Preeti Madhuri (B.Ed Special Ed)'],
  ['DETAILS OF COUNSELLOR AND WELLNESS TEACHER', 'Miss. Prerna Gosain (M.Sc Clinical Psych)']
];

const infraInfo = [
  ['TOTAL CAMPUS AREA OF THE SCHOOL (IN SQ MTR)', 'Picturesque NDA Premises (~16,000+ sq mtr)'],
  ['NO. AND SIZE OF THE CLASS ROOMS (IN SQ FT)', '38 Classrooms (500 sq. ft. each)'],
  ['NO. AND SIZE OF LABORATORIES INCLUDING COMPUTER LABS', '5 Labs: Physics (1), Chemistry (1), Biology (1), Computer Labs (2)'],
  ['INTERNET FACILITY', 'YES (High Speed Leased Optical Fiber)'],
  ['NO. OF GIRLS TOILETS', '14'],
  ['NO. OF BOYS TOILETS / URINALS', '13 Toilets + 12 Urinals'],
  ['SMART CLASSROOM BOARDS', '34 Interactive Smart Panels'],
  ['COMPUTERS INSTALLED', '136 Systems (Dell, HP, Thin Clients, Server)'],
  ['CCTV SURVEILLANCE CAMERAS', '146 HD CCTV Cameras with 24x7 Command Room']
];

export default function MandatoryDisclosure() {
  const [activeTab, setActiveTab] = useState('general');

  return (
    <div className="pt-24 bg-bg-light min-h-screen">
      {/* Header */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-xs font-bold tracking-widest uppercase mb-3">
            <FiShield className="text-accent" /> CBSE Circular Compliance
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
            Mandatory Public Disclosure (SARAS)
          </h1>
          <p className="max-w-2xl mx-auto text-gray-300 text-sm sm:text-base">
            In compliance with Appendix IX of CBSE Affiliation Bye-Laws 2018 for Army Public School Khadakwasla (Affiliation: 1180026).
          </p>
        </div>
      </section>

      {/* Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { id: 'general', label: 'A: General Information', icon: FiInfo },
            { id: 'docs', label: 'B: Documents & Info', icon: FiFileText },
            { id: 'staff', label: 'C: Staff & Teaching', icon: FiUsers },
            { id: 'infra', label: 'D: School Infrastructure', icon: FiHome }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                activeTab === id ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon /> {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-200/70">
          {activeTab === 'general' && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FiInfo className="text-accent" /> A. General Information
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
                  <tbody className="divide-y divide-gray-200">
                    {generalInfo.map(([key, val], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'}>
                        <td className="p-4 font-bold text-xs sm:text-sm text-primary w-1/2 border-r border-gray-200">
                          {key}
                        </td>
                        <td className="p-4 text-xs sm:text-sm text-gray-700 font-medium">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FiFileText className="text-accent" /> B. Documents and Information
              </h2>
              <div className="space-y-3">
                {documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-accent/40 bg-gray-50/50 transition-colors gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <FiCheckCircle className="text-green-600 mt-1 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-gray-800">
                        {doc.name}
                      </span>
                    </div>
                    <span className="shrink-0 self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
                      Verified On Record
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FiUsers className="text-accent" /> C. Staff (Teaching)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
                  <tbody className="divide-y divide-gray-200">
                    {staffInfo.map(([key, val], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'}>
                        <td className="p-4 font-bold text-xs sm:text-sm text-primary w-1/2 border-r border-gray-200">
                          {key}
                        </td>
                        <td className="p-4 text-xs sm:text-sm text-gray-700 font-medium">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'infra' && (
            <div>
              <h2 className="font-heading text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FiHome className="text-accent" /> D. School Infrastructure
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border border-gray-200 rounded-xl overflow-hidden">
                  <tbody className="divide-y divide-gray-200">
                    {infraInfo.map(([key, val], idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50/70' : 'bg-white'}>
                        <td className="p-4 font-bold text-xs sm:text-sm text-primary w-1/2 border-r border-gray-200">
                          {key}
                        </td>
                        <td className="p-4 text-xs sm:text-sm text-gray-700 font-medium">
                          {val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
