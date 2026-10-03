import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiPlus, FiTrash2, FiLayers } from 'react-icons/fi';
import { api } from '../../utils/api';
import { toast } from '../../utils/toast';

const defaultPagesData = {
  about: {
    title: 'About Us',
    eyebrow: 'Our story and values',
    intro: 'A legacy of academic excellence, holistic development and disciplined service to defence families.',
    sections: [
      {
        id: 'history',
        title: 'History',
        text: 'NDA English School was established on 1st February 1955. In 1975, it was taken over by the National Defence Academy (NDA) from the Pune Jesuits Society. The following year, in 1976, the school was registered under the Society Registration Act and later under the Zilla Parishad in 1980. A major milestone came in 2012 when the school was upgraded to Army Public School (APS) Khadakwasla, with Class VI as the highest class at the time.\n\nThe school continued to grow steadily, receiving affiliation from the Central Board of Secondary Education (CBSE) on 10th February 2014. In 2016, it was further upgraded to include Class X, effective from 1st April. Another significant achievement came on 11th August 2021, when APS Khadakwasla was upgraded to a Senior Secondary School, offering education up to Class XII.\n\nAt present, the school comprises 38 well-equipped classrooms and provides quality education from Classes I to XII. With a student strength of over 1,700, APS Khadakwasla continues to uphold its legacy of academic excellence and holistic development in a disciplined and nurturing environment.'
      },
      {
        id: 'vision',
        title: 'Vision and Mission',
        text: 'Vision: Be an organization committed to excellence for holistic development of children, making them global citizens for nation building.\n\nMission: To provide enabling learning environment with empowered faculty and required Infrastructure for children to realise full potential and face challenges of life.'
      },
      {
        id: 'awes',
        title: 'Army Welfare Education Society (AWES)',
        text: 'Army Public School Khadakwasla is part of the wide network of schools governed by Army Welfare Education Society, which aims to provide quality education to wards of defence personnel.'
      },
      {
        id: 'rules',
        title: 'School Rules & Discipline',
        text: '1. Identity card must be worn to school on all days and the school diary must be brought every day.\n2. Minimum 75% attendance is required; leave should be applied for in advance.\n3. Students are expected to greet teachers and elders, show behavioural excellence.\n4. Students must be present 10 minutes before the scheduled time (Gate closes at 7:40 AM).\n5. Uniforms must be neat, washed and ironed, with well-groomed hair.\n6. Mobile phones are strictly prohibited on campus.'
      }
    ]
  },
  infrastructure: {
    title: 'Campus & Infrastructure',
    eyebrow: 'Our campus',
    intro: 'A safe, modern and stimulating campus designed to help every learner explore, create and grow in the picturesque NDA surroundings.',
    sections: [
      {
        id: 'classrooms',
        title: 'Classrooms & Smart Boards',
        text: 'Each of our 38 classrooms is well equipped with quality study furniture, racks, cupboards, bulletin boards and 34 interactive smart boards for immersive multimedia learning.'
      },
      {
        id: 'computer-labs',
        title: 'Computer & AI Laboratories',
        text: 'Our computer center features 136 systems including Dell and HP PCs, thin clients and a dedicated server running modern programming environments like Python, Scratch, MySQL, and Web Design tools.'
      },
      {
        id: 'library',
        title: 'Central Library',
        text: 'The library contains over 9,000 physical volumes, 20 educational magazines, daily periodicals, and 12 digital Kindles covering classic literature, science, and competitive examination preparation.'
      },
      {
        id: 'sports',
        title: 'Sports & Athletic Facilities',
        text: 'Sprawling grounds for athletics, badminton courts, cricket, football, basketball, Kho-Kho, Kabbadi, martial arts, and yoga under trained physical education coaches.'
      }
    ]
  },
  cca: {
    title: 'Co-Curricular Activities (CCA)',
    eyebrow: 'Beyond the classroom',
    intro: 'Students discover their talents, build sportsmanship, and express cultural creativity through a diverse calendar of activities.',
    sections: [
      {
        id: 'house-system',
        title: 'House System',
        text: 'Students are divided into four houses: Shivaji (Saffron), RanaPratap (White), Ashoka (Green), and Ranjit (Gold) participating in regular inter-house competitions.'
      },
      {
        id: 'clubs',
        title: 'Clubs & Societies',
        text: 'Active clubs including Eco Club, Science & Robotics, Literary & Debating Society, Heritage Club, and NCC displays fostering leadership and social responsibility.'
      }
    ]
  },
  achievements: {
    title: 'School Achievements & Laurels',
    eyebrow: 'Pride of APS Khadakwasla',
    intro: 'Celebrating the academic excellence, athletic triumphs, and creative accomplishments of our young champions.',
    sections: [
      {
        id: 'board-honors',
        title: '100% CBSE Board Results',
        text: 'APS Khadakwasla consistently secures 100% pass percentages in Class X (AISSE) and Class XII (AISSCE) board examinations with numerous subject toppers.'
      },
      {
        id: 'folk-song',
        title: 'Inter-House Folk Song Champions',
        text: 'Recognizing our celebrated vocalists: Pragati Sonar, Vaibhavi Sonawane, Devansh Ghadage, Avanti Salunke, Prachi Singh, Shravani Devare, Lara Gawade, Kumari Saloni, Abhijeet Dhokrat, and Jyoti Sarode.'
      }
    ]
  },
  hpd: {
    title: 'Holistic Personality Development (HPD)',
    eyebrow: 'Values & Life Skills',
    intro: 'Nurturing sound moral character, resilience, empathy, and emotional quotient alongside academic brilliance.',
    sections: [
      {
        id: 'value-education',
        title: 'Value Education Annual Plan',
        text: 'Structured monthly themes centering on integrity, discipline, national pride, environmental conservation, and social empathy integrated into daily morning assemblies.'
      },
      {
        id: 'life-skills',
        title: 'Life Skills & Counselling Services',
        text: 'Regular guidance sessions conducted by our dedicated school counsellor Miss Prerna Gosain and Special Educator Miss Preeti Madhuri for student mental wellness.'
      }
    ]
  },
  recruitment: {
    title: 'Faculty & Staff Recruitment',
    eyebrow: 'Join our team',
    intro: 'Army Public School Khadakwasla invites passionate, visionary educators to join our dedicated academic team.',
    sections: [
      {
        id: 'criteria',
        title: 'Eligibility Criteria & Vacancies',
        text: 'Selections are conducted in accordance with AWES and CSB guidelines. Candidates must possess required educational qualifications, CTET/TET certification where applicable, and fluency in English.'
      }
    ]
  }
};

export default function ManagePages() {
  const [selectedKey, setSelectedKey] = useState('about');
  const [pageData, setPageData] = useState(defaultPagesData.about);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.list(`pages/${selectedKey}`)
      .then((res) => {
        if (res.data && res.data.content && res.data.content.sections) {
          setPageData(res.data.content);
        } else {
          setPageData(defaultPagesData[selectedKey] || { title: selectedKey, eyebrow: '', intro: '', sections: [] });
        }
        setLoading(false);
      })
      .catch(() => {
        setPageData(defaultPagesData[selectedKey] || { title: selectedKey, eyebrow: '', intro: '', sections: [] });
        setLoading(false);
      });
  }, [selectedKey]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.update('pages', selectedKey, {
        title: pageData.title,
        content: pageData
      });
      toast.success(`${pageData.title} saved live!`);
    } catch (err) {
      toast.error(err.message || 'Failed to save page');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (idx, field, val) => {
    const updated = [...pageData.sections];
    updated[idx] = { ...updated[idx], [field]: val };
    setPageData({ ...pageData, sections: updated });
  };

  const addSection = () => {
    const newSec = {
      id: `sec-${Date.now()}`,
      title: 'New Section Title',
      text: 'Enter the section description and information here.'
    };
    setPageData({ ...pageData, sections: [...pageData.sections, newSec] });
  };

  const removeSection = (idx) => {
    if (!window.confirm('Delete this section?')) return;
    const updated = pageData.sections.filter((_, i) => i !== idx);
    setPageData({ ...pageData, sections: updated });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary flex items-center gap-3">
            <FiLayers className="text-accent" /> Page Content Editor
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Edit text, headings, and sections of any public page on the website.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:bg-secondary transition-all disabled:opacity-60"
        >
          <FiSave /> {saving ? 'Saving Live...' : 'Save Changes'}
        </motion.button>
      </div>

      {/* Page Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-gray-200">
        {[
          { key: 'about', label: 'About Us' },
          { key: 'infrastructure', label: 'Infrastructure' },
          { key: 'cca', label: 'CCA' },
          { key: 'achievements', label: 'Achievements' },
          { key: 'hpd', label: 'HPD' },
          { key: 'recruitment', label: 'Recruitment' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSelectedKey(tab.key)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              selectedKey === tab.key
                ? 'bg-primary text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading page content...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                value={pageData.title || ''}
                onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
                className="w-full p-3.5 border border-gray-300 rounded-xl font-semibold text-primary focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                Header Eyebrow / Tagline
              </label>
              <input
                type="text"
                value={pageData.eyebrow || ''}
                onChange={(e) => setPageData({ ...pageData, eyebrow: e.target.value })}
                className="w-full p-3.5 border border-gray-300 rounded-xl text-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
              Intro Paragraph
            </label>
            <textarea
              rows={3}
              value={pageData.intro || ''}
              onChange={(e) => setPageData({ ...pageData, intro: e.target.value })}
              className="w-full p-3.5 border border-gray-300 rounded-xl text-gray-700 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none leading-relaxed"
            />
          </div>

          {/* Sections List */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-bold text-xl text-primary">
                Page Sections ({pageData.sections?.length || 0})
              </h3>
              <button
                onClick={addSection}
                className="flex items-center gap-1.5 px-4 py-2 bg-accent/20 text-primary font-bold rounded-lg text-sm hover:bg-accent/30 transition-colors"
              >
                <FiPlus /> Add Section
              </button>
            </div>

            <div className="space-y-6">
              {pageData.sections?.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="p-5 rounded-2xl border border-gray-200 bg-gray-50/60 hover:border-accent/40 transition-colors"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                      Section #{idx + 1}
                    </span>
                    <button
                      onClick={() => removeSection(idx)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors text-sm"
                      title="Delete Section"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Section Title"
                      value={sec.title || ''}
                      onChange={(e) => updateSection(idx, 'title', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg font-bold text-primary bg-white focus:border-accent outline-none"
                    />
                    <textarea
                      rows={5}
                      placeholder="Section Text / Content"
                      value={sec.text || ''}
                      onChange={(e) => updateSection(idx, 'text', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg text-gray-700 bg-white focus:border-accent outline-none text-sm leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
