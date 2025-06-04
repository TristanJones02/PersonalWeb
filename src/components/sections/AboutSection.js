import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography, Tooltip, Chip, Drawer, Box, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const AboutSection = () => {
  const theme = useTheme();
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState(null);
  const [educationModalOpen, setEducationModalOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState(null);
  const [certificationModalOpen, setCertificationModalOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [unitDrawerOpen, setUnitDrawerOpen] = useState(false);

  // Utility function to convert hex to rgba
  const hexToRgba = (hex, alpha) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return hex;
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const unitDescriptions = {
    'ICT100': 'A beginner-friendly unit that helps students transition into IT studies by exploring the IT industry and job roles while building fundamental IT skills',
    'MSP100': 'Helps students clarify their career goals and plan the skills development needed for future career success',
    'ICT159': 'Introduces fundamental programming concepts and problem-solving using a high-level language, covering data storage, basic control structures, and simple data structures',
    'ICT171': 'Introduces server environments and architectures, covering server hardware, operating systems, virtualization, and cloud computing',
    'ICT169': 'Provides an introduction to how computer networks and the internet work, covering fundamentals like the OSI/TCP-IP models, IP addressing, Ethernet, wireless networks, and basic network security',
    'ICT201': 'Built around a practical IT project to teach project management, helping students understand real-world issues in planning and delivering IT projects',
    'MSP200': 'Encourages students to assess their current skills and experiences against industry expectations, and develop the enterprise skills valued by employers',
    'ICT145': 'An accessible introduction to programming that uses Python to teach basic coding concepts and develop problem-solving skills',
    'ICT284': 'Focuses on methods and techniques for analyzing business problems and designing information systems, including requirements gathering, system modeling, and design documentation',
    'ICT299': 'Gives students hands-on experience in an IT service environment (e.g. an IT helpdesk), applying service management practices to deliver real IT support services',
    'ICT111': 'Introduces fundamental cybersecurity principles, covering common cyber threats, basic risk assessment, and essential measures for protecting systems and data',
    'ICT285': 'Explores core database concepts, design, and implementation, including relational databases, SQL, and database management systems',
    'MAS183': 'Explores statistical analysis techniques, including descriptive statistics, hypothesis testing, and regression analysis',
    'ICT280': 'Examines information security at the organizational level, focusing on security policies, standards, regulatory requirements, data protection laws, best practices, and risk management',
    'ICT279': 'Provides a solid understanding of computer security architecture components and mechanisms, and how they are used to secure systems',
    'BSC203': 'Introduces ICT research, exploring the types of questions in the field and a range of research methods (e.g. action research, case studies, experiments, surveys)',
    'ICT378': 'Teaches the fundamentals of digital forensics and incident response, covering digital evidence preservation, forensic analysis, and the basics of security operations and incident handling',
    'ICT387': 'Provides an in-depth understanding of malware, software vulnerabilities, and ethical hacking techniques, along with practical skills to identify and fix security weaknesses',
    'ICT302': 'A capstone team project where students apply their IT skills to solve a real-world problem for a client, emphasizing interdisciplinary teamwork, project management, and professional communication',
    // TAFE Certificate III in IDMT units
    'BSBWHS302': 'Understand how to follow WHS laws and keep yourself and others safe at work.',
    'BSBFLM303': 'Learn to build respectful and productive relationships in a team.',
    'BSBITU312': 'Build visually engaging presentations using software like PowerPoint.',
    'BSBCUS301': 'Discover how to deliver good service and handle customer needs effectively.',
    'BSBITU306': 'Create various professional business documents like forms and letters.',
    'BSBITU313': 'Create clear digital text documents using word processors.',
    'BSBITU314': 'Build basic spreadsheets to organize and calculate data.',
    'BSBITU309': 'Produce print-ready documents using desktop publishing tools.',
    'BSBINN301': 'Explore creative thinking and how to support innovation in teams.',
    'BSBWOR204': 'Use business tools and work well with others in a team.',
    'BSBDIV301': 'Learn how to collaborate in diverse workplaces and respect cultural differences.',
    'BSBWRT301': 'Write simple but effective business documents.',
    'BSBCMM201': 'Improve basic communication skills in a professional setting.',
    'BSBWHS201': 'Know your WHS duties and how to keep yourself and others safe.',
    'BSBINN201': 'Learn how to support new ideas and improvements in the workplace.',
    'BSBITU212': 'Learn to build and use simple spreadsheets for basic tasks.',
    'BSBSMB201': 'Identify if running a small or micro business is a good fit for you.',
    'BSBSUS201': 'Understand and help implement eco-friendly practices at work.',
    'BSBITU211': 'Create digital documents using basic word processing tools.',
    'BSBITU213': 'Use digital tools like email and chat to communicate remotely.',
    'BSBWOR203': 'Work well with teammates in a collaborative environment.',
    'ICTICT301': 'Create easy-to-follow user guides and documentation for systems.',
    'ICTNWK306': 'Understand cloud computing and compare different cloud services.',
    'ICTICT305': 'Explore emerging technologies used in specific industries.',
    'BSBSUS401': 'Help introduce and monitor sustainability practices at work.',
    'BSBWHS304': 'Join workplace safety discussions and contribute to WHS practices.',
    'ICTICT202': 'Develop skills to work and communicate in an IT workplace.',
    'ICTNWK403': 'Maintain network stability and protect data from corruption.',
    'ICTSAS418': 'Monitor system security and handle basic cyber threats.',
    'ICTSAS305': 'Assist clients by offering IT support and advice.',
    'ICTNWK406': 'Set up and test network security to protect systems.',
    'ICTSAS301': 'Use tools to diagnose and resolve IT issues.',
    'ICTSAS303': 'Maintain and troubleshoot physical computer components.',
    'ICTNWK303': 'Set up and manage basic network operating systems.',
    'ICTICT303': 'Install hardware components like RAM or drives inside a computer.',
    'ICTICT302': 'Install and configure operating systems for optimal performance.',
    'ICTSAS306': 'Keep IT equipment and software updated and working properly.',
    'ICTSAS304': 'Perform admin tasks like managing users and system settings.',
    // Certificate II in Business units
    'BSBCUS201': 'Developed skills to provide effective customer service and handle customer interactions.',
    'BSBIND201': 'Gained understanding of workplace expectations and how to operate effectively within them.',
    'BSBINM201': 'Learned to handle and maintain business information systems efficiently.',
    'BSBINM202': 'Acquired skills to receive and dispatch incoming and outgoing mail.',
    // Certificate III in Business units
    'BSBADM311': 'Managed and maintained business resources to ensure efficiency.',
    'BSBCMM301': 'Handled customer complaints effectively to maintain customer satisfaction.',
    'BSBFIA301': 'Maintained accurate financial records in compliance with organizational policies.',
    'BSBINM301': 'Organized and managed workplace information systems efficiently.',
    'BSBWOR301': 'Managed personal work schedules and pursued professional development opportunities.',
    // Certificate I in Hospitality units
    'SITXCCS001': 'Assisted customers by providing accurate information and support.',
    'SITXWHS001': 'Engaged in safe work practices to ensure personal and team safety.',
    'SITHIND001': 'Applied hygiene procedures to maintain cleanliness in hospitality settings.',
    'SITXFSA001': 'Followed food safety guidelines to prevent contamination.',
    'SITHCCC001': 'Operated basic food preparation equipment safely and effectively.',
    // Certificate II in Hospitality units
    'SITHIND002': 'Researched and applied industry information to enhance work performance.',
    'SITHIND003': 'Applied hospitality skills in real-world settings to meet service standards.',
    'SITXCCS003': 'Provided quality customer service through effective communication.',
    'SITXCOM002': 'Demonstrated respect and sensitivity towards diverse cultures and backgrounds.',
    'SITHCCC002': 'Prepared basic dishes following standard recipes and presentation techniques.',
    'SITHFAB005': 'Crafted and served espresso-based coffee beverages to customers.',
    'SITHFAB007': 'Delivered food and beverages to guests in a professional manner.',
    'SITXINV001': 'Managed inventory by receiving and storing stock appropriately.',
    // Certificate II in Kitchen Operations units
    'SITHCCC005': 'Applied fundamental cooking techniques to prepare a variety of dishes.',
    'SITHCCC011': 'Demonstrated proficiency in cookery skills during service periods in a commercial kitchen.',
    'SITHKOP001': 'Maintained cleanliness and hygiene standards in kitchen areas and equipment.',
    'SITXINV002': 'Managed storage conditions to preserve the quality and safety of perishable food items.',
    'TLIE1005': 'Performed basic mathematical calculations relevant to kitchen operations.',
    'SITHCCC003': 'Assembled and presented a range of sandwiches to meet customer requirements.',
    'SITHCCC004': 'Packaged food items appropriately for storage or takeaway, ensuring quality and safety.',
    'SITHCCC006': 'Created a variety of appetisers and salads, focusing on presentation and taste.',
    'SITHCCC007': 'Prepared foundational stocks, sauces, and soups essential for various dishes.',
    'SITHCCC008': 'Cooked a range of dishes using vegetables, fruits, eggs, and farinaceous products.',
    'SITHCCC009': 'Prepared food items using cook-chill and cook-freeze methods for later consumption.',
    'SITHCCC010': 'Safely reheated chilled and frozen foods to appropriate serving temperatures.',
    'HLTAID011': 'Delivered basic first aid in response to workplace incidents and emergencies.',
    'SITXFSA002': 'Followed procedures to handle food safely, minimizing risks of contamination.',
    'SITXFSA003': 'Managed the transportation and storage of food items to maintain quality and safety.'
  };

  const educationDetails = {
    'murdoch': {
      title: 'Bachelor of Information Technology - Cyber Security',
      institution: 'Murdoch University, Perth',
      period: 'January 2021 — Present',
      description: 'I\'m currently studying a Cyber Security and Forensics major as part of my Bachelor of Information Technology at Murdoch University. The course covers practical and theoretical foundations in network and software security, digital forensics, penetration testing, and information security governance. It also includes hands-on experience solving real-world IT problems through project-based work with industry clients.',
      completed: [
        { code: 'ICT100', name: 'Transition to IT' },
        { code: 'MSP100', name: 'Career Learning' },
        { code: 'ICT159', name: 'Foundations of Programming' },
        { code: 'ICT171', name: 'Introduction to Server Environments and Architectures' },
        { code: 'ICT169', name: 'Foundations of Data Communications' },
        { code: 'ICT201', name: 'Information Technology Project Management' },
        { code: 'MSP200', name: 'Building Enterprise Skills' },
        { code: 'ICT145', name: 'Python Programming for Everyone' },
        { code: 'ICT284', name: 'Systems Analysis and Design' },
        { code: 'ICT299', name: 'Service Management Experience' }
      ],
      inProgress: [
        { code: 'ICT111', name: 'Cybersecurity Fundamentals' },
        { code: 'ICT285', name: 'Databases' },
        { code: 'MAS183', name: 'Statistical Data Analysis' },
        { code: 'ICT280', name: 'Information Security Policy & Governance' },
        { code: 'ICT279', name: 'Security Architectures and Controls' },
        { code: 'BSC203', name: 'Introduction to ICT Research Methods' },
        { code: 'ICT378', name: 'Cyber Forensics & Incident Response' },
        { code: 'ICT387', name: 'Ethical Hacking & Software Security' },
        { code: 'ICT302', name: 'IT Professional Practice Project' }
      ]
    },
    'tafe-cybersecurity': {
      title: 'Certificate III in IDMT (Cyber Security)',
      institution: 'South Metro TAFE',
      period: '2019',
      description: 'This qualification provided hands-on training in core IT skills, workplace communication, and introductory cybersecurity. It included experience with installing operating systems, configuring basic network security, running diagnostics, and advising clients on IT solutions. The course also focused on developing teamwork, documentation, and customer service skills in a technology-driven environment.',
      completed: [
        { code: 'BSBWHS302', name: 'Apply Knowledge of WHS Legislation in the Workplace' },
        { code: 'BSBFLM303', name: 'Contribute to Effective Workplace Relationships' },
        { code: 'BSBITU312', name: 'Create Electronic Presentations' },
        { code: 'BSBCUS301', name: 'Deliver and Monitor a Service to Customers' },
        { code: 'BSBITU306', name: 'Design and Produce Business Documents' },
        { code: 'BSBITU313', name: 'Design and Produce Digital Text Documents' },
        { code: 'BSBITU314', name: 'Design and Produce Spreadsheets' },
        { code: 'BSBITU309', name: 'Produce Desktop Published Documents' },
        { code: 'BSBINN301', name: 'Promote Innovation in a Team Environment' },
        { code: 'BSBWOR204', name: 'Use Business Technology' },
        { code: 'BSBDIV301', name: 'Work Effectively with Diversity' },
        { code: 'BSBWRT301', name: 'Write Simple Documents' },
        { code: 'BSBCMM201', name: 'Communicate in the Workplace' },
        { code: 'BSBWHS201', name: 'Contribute to Health and Safety of Self and Others' },
        { code: 'BSBINN201', name: 'Contribute to Workplace Innovation' },
        { code: 'BSBITU212', name: 'Create and Use Spreadsheets' },
        { code: 'BSBSMB201', name: 'Identify Suitability for Micro Business' },
        { code: 'BSBSUS201', name: 'Participate in Environmentally Sustainable Work Practices' },
        { code: 'BSBITU211', name: 'Produce Digital Text Documents' },
        { code: 'BSBITU213', name: 'Use Digital Technologies to Communicate Remotely' },
        { code: 'BSBWOR203', name: 'Work Effectively with Others' },
        { code: 'ICTICT301', name: 'Create User Documentation' },
        { code: 'ICTNWK306', name: 'Evaluate Characteristics of Cloud Computing Solutions and Services' },
        { code: 'ICTICT305', name: 'Identify and Use Current Industry Specific Technologies' },
        { code: 'BSBSUS401', name: 'Implement and Monitor Environmentally Sustainable Work Practices' },
        { code: 'BSBWHS304', name: 'Participate Effectively in WHS Communication and Consultation Processes' },
        { code: 'ICTICT202', name: 'Work and Communicate Effectively in an ICT Environment' },
        { code: 'ICTNWK403', name: 'Manage Network and Data Integrity' },
        { code: 'ICTSAS418', name: 'Monitor and Administer Security of an ICT System' },
        { code: 'ICTSAS305', name: 'Provide ICT Advice to Clients' },
        { code: 'ICTNWK406', name: 'Install, Configure and Test Network Security' },
        { code: 'ICTSAS301', name: 'Run Standard Diagnostic Tests' },
        { code: 'ICTSAS303', name: 'Care for Computer Hardware' },
        { code: 'ICTNWK303', name: 'Configure and Administer a Network Operating System' },
        { code: 'ICTICT303', name: 'Connect Internal Hardware Components' },
        { code: 'ICTICT302', name: 'Install and Optimise Operating System Software' },
        { code: 'ICTSAS306', name: 'Maintain Equipment and Software' },
        { code: 'ICTSAS304', name: 'Provide Basic System Administration' }
      ]
    }
  };

  const certificationDetails = {
    'front-desk': {
      title: 'Certified Front Desk Representative',
      organization: 'American Hotel & Lodging Association',
      period: 'April 2023',
      description: 'Gained foundational hospitality knowledge and soft skills, with practical training on 16 key front desk tasks. These included equipment use, key control, guest check-in/out procedures, and effective sales and upselling techniques.'
    },
    'mental-health': {
      title: 'Crisis Intervention and Mental Health First Aid',
      organization: 'Mental Health First Aid International',
      period: 'September 2023',
      description: 'Completed Mental Health First Aid training focused on recognising signs of common mental health issues in adults and providing effective initial support. Gained skills in crisis response, referral pathways, and evidence-based approaches to helping others.'
    },
    'cert-ii-business': {
      title: 'Certificate II in Business',
      organization: 'Skill Strategies International (RTO)',
      period: 'January — December 2020',
      description: 'I have successfully completed the BSB20115 Certificate II in Business, equipping me with foundational administrative skills essential for junior business roles. This qualification provided me with practical experience in workplace communication, basic computing, and understanding business operations, preparing me for entry-level positions in various business environments.',
      units: [
        { code: 'BSBWHS201', name: 'Contribute to health and safety of self and others' },
        { code: 'BSBCUS201', name: 'Deliver a service to customers' },
        { code: 'BSBIND201', name: 'Work effectively in a business environment' },
        { code: 'BSBINM201', name: 'Process and maintain workplace information' },
        { code: 'BSBINM202', name: 'Handle mail' },
        { code: 'BSBINN201', name: 'Contribute to workplace innovation' },
        { code: 'BSBCMM201', name: 'Communicate in the workplace' },
        { code: 'BSBITU211', name: 'Produce digital text documents' },
        { code: 'BSBITU212', name: 'Create and use spreadsheets' },
        { code: 'BSBITU213', name: 'Use digital technologies to communicate remotely' },
        { code: 'BSBSMB201', name: 'Identify suitability for micro business' },
        { code: 'BSBSUS201', name: 'Participate in environmentally sustainable work practices' }
      ]
    },
    'cert-iii-business': {
      title: 'Certificate III in Business',
      organization: 'Skill Strategies International (RTO)',
      period: 'January — December 2020',
      description: 'Having completed the BSB30115 Certificate III in Business, I have developed a broad range of competencies applicable across various business sectors. This qualification enhanced my abilities in administrative tasks, customer service, and workplace communication, enabling me to provide technical advice and support within a team environment.',
      units: [
        { code: 'BSBWHS302', name: 'Apply knowledge of WHS legislation in the workplace' },
        { code: 'BSBADM311', name: 'Maintain business resources' },
        { code: 'BSBCMM301', name: 'Process customer complaints' },
        { code: 'BSBCUS301', name: 'Deliver and monitor a service to customers' },
        { code: 'BSBDIV301', name: 'Work effectively with diversity' },
        { code: 'BSBFIA301', name: 'Maintain financial records' },
        { code: 'BSBFLM303', name: 'Contribute to effective workplace relationships' },
        { code: 'BSBINM301', name: 'Organise workplace information' },
        { code: 'BSBITU306', name: 'Design and produce business documents' },
        { code: 'BSBWOR301', name: 'Organise personal work priorities and development' },
        { code: 'BSBWRT301', name: 'Write simple documents' },
        { code: 'BSBSUS401', name: 'Implement and monitor environmentally sustainable work practices' }
      ]
    },
    'cert-i-hospitality': {
      title: 'Certificate I in Hospitality',
      organization: 'Hospitality Group Training (RTO)',
      period: 'February 2018 — December 2019',
      description: 'By completing the SIT10216 Certificate I in Hospitality, I gained foundational skills for entry-level roles in the hospitality industry. This qualification introduced me to basic customer service, workplace safety, and hygiene practices, preparing me for roles such as bar useful, food runner, or housekeeping assistant.',
      units: [
        { code: 'BSBWOR203', name: 'Work effectively with others' },
        { code: 'SITXCCS001', name: 'Provide customer information and assistance' },
        { code: 'SITXWHS001', name: 'Participate in safe work practices' },
        { code: 'SITHIND001', name: 'Use hygienic practices for hospitality service' },
        { code: 'SITXFSA001', name: 'Use hygienic practices for food safety' },
        { code: 'SITHCCC001', name: 'Use food preparation equipment' }
      ]
    },
    'cert-ii-hospitality': {
      title: 'Certificate II in Hospitality',
      organization: 'Hospitality Group Training (RTO)',
      period: 'February 2018 — December 2019',
      description: 'Completing the SIT20316 Certificate II in Hospitality allowed me to develop operational skills for various hospitality settings. I learned to interact with customers, work effectively in teams, and perform tasks under supervision, preparing me for roles such as bar attendant, café attendant, or catering assistant.',
      units: [
        { code: 'BSBWOR203', name: 'Work effectively with others' },
        { code: 'SITHIND002', name: 'Source and use information on the hospitality industry' },
        { code: 'SITHIND003', name: 'Use hospitality skills effectively' },
        { code: 'SITXCCS003', name: 'Interact with customers' },
        { code: 'SITXCOM002', name: 'Show social and cultural sensitivity' },
        { code: 'SITXWHS001', name: 'Participate in safe work practices' },
        { code: 'SITHIND001', name: 'Use hygienic practices for hospitality service' },
        { code: 'SITXFSA001', name: 'Use hygienic practices for food safety' },
        { code: 'SITHCCC002', name: 'Prepare and present simple dishes' },
        { code: 'SITHFAB005', name: 'Prepare and serve espresso coffee' },
        { code: 'SITHFAB007', name: 'Serve food and beverage' },
        { code: 'SITXINV001', name: 'Receive and store stock' }
      ]
    },
    'cert-ii-kitchen': {
      title: 'Certificate II in Kitchen Operations',
      organization: 'Hospitality Group Training (RTO)',
      period: 'February — December 2020',
      description: 'I have successfully completed the SIT20416 Certificate II in Kitchen Operations, which provided me with foundational skills and knowledge essential for working in commercial kitchen environments. Throughout the course, I developed competencies in food preparation, hygiene practices, kitchen safety, and teamwork, preparing me for roles such as kitchen hand, catering assistant, or food preparation assistant.',
      units: [
        { code: 'BSBWOR203', name: 'Work effectively with others' },
        { code: 'SITHCCC001', name: 'Use food preparation equipment' },
        { code: 'SITHCCC005', name: 'Prepare dishes using basic methods of cookery' },
        { code: 'SITHCCC011', name: 'Use cookery skills effectively' },
        { code: 'SITHKOP001', name: 'Clean kitchen premises and equipment' },
        { code: 'SITXFSA001', name: 'Use hygienic practices for food safety' },
        { code: 'SITXINV002', name: 'Maintain the quality of perishable items' },
        { code: 'SITXWHS001', name: 'Participate in safe work practices' },
        { code: 'TLIE1005', name: 'Carry out basic workplace calculations' },
        { code: 'SITXCCS003', name: 'Interact with customers' },
        { code: 'SITHCCC002', name: 'Prepare and present simple dishes' },
        { code: 'SITHCCC003', name: 'Prepare and present sandwiches' },
        { code: 'SITHCCC004', name: 'Package prepared foodstuffs' },
        { code: 'SITHCCC006', name: 'Prepare appetisers and salads' },
        { code: 'SITHCCC007', name: 'Prepare stocks, sauces and soups' },
        { code: 'SITHCCC008', name: 'Prepare vegetable, fruit, egg and farinaceous dishes' },
        { code: 'SITHCCC009', name: 'Produce cook-chill and cook-freeze foods' },
        { code: 'SITHCCC010', name: 'Re-thermalise chilled and frozen foods' },
        { code: 'BSBCMM201', name: 'Communicate in the workplace' },
        { code: 'SITXCOM002', name: 'Show social and cultural sensitivity' },
        { code: 'BSBSUS201', name: 'Participate in environmentally sustainable work practices' },
        { code: 'HLTAID011', name: 'Provide first aid' },
        { code: 'SITXFSA002', name: 'Participate in safe food handling practices' },
        { code: 'SITXFSA003', name: 'Transport and store food' },
        { code: 'SITHIND002', name: 'Source and use information on the hospitality industry' }
      ]
    }
  };

  const skillDetails = {
    'Management & Leadership': {
      title: 'Management & Leadership',
      description: 'Leading teams and managing operations across multiple business locations. Experience in strategic planning, team coordination, and driving operational efficiency while maintaining high service standards.',
      examples: [
        'Managing IT systems across 3 Pet Fresh locations',
        'Leading customer service teams in high-pressure environments',
        'Implementing new systems and training staff on adoption'
      ]
    },
    'Communication Skills': {
      title: 'Communication Skills',
      description: 'Strong verbal and written communication abilities developed through customer-facing roles and technical documentation. Experienced in translating complex technical concepts for diverse audiences.',
      examples: [
        'Client communication for technical implementations',
        'Training documentation and user guides',
        'Cross-cultural communication in international hotel environment'
      ]
    },
    'Customer Service': {
      title: 'Customer Service',
      description: 'Extensive experience in delivering exceptional customer experiences, from 5-star hotel service to specialized pet nutrition consulting. Focus on understanding customer needs and exceeding expectations.',
      examples: [
        '5-star service delivery at Fairmont Whistler Hotel',
        'Pet nutrition consulting for customers with special needs',
        'Complaint resolution and customer retention strategies'
      ]
    },
    'Multitasking': {
      title: 'Multitasking',
      description: 'Proven ability to manage multiple priorities simultaneously while maintaining quality and attention to detail. Essential skill developed through fast-paced hospitality and IT management roles.',
      examples: [
        'Managing multiple IT projects across different locations',
        'Handling room service orders while maintaining guest relations',
        'Balancing customer service with inventory management'
      ]
    },
    'Working Under Pressure': {
      title: 'Working Under Pressure',
      description: 'Thriving in high-pressure environments including peak hotel service periods and critical IT system implementations. Maintaining composure and decision-making ability during challenging situations.',
      examples: [
        'Emergency IT system troubleshooting during business hours',
        'Peak service periods in 5-star hotel environment',
        'Managing customer complaints during busy retail periods'
      ]
    },
    'System Integration': {
      title: 'System Integration',
      description: 'Technical expertise in connecting and optimizing various business systems including POS, eCommerce, and warehouse management platforms. Focus on creating seamless operational workflows.',
      examples: [
        'Integrating POS systems with inventory management',
        'Warehouse Management System implementation',
        'eCommerce platform optimization and connectivity'
      ]
    },
    'Cyber Security': {
      title: 'Cyber Security',
      description: 'Academic and practical knowledge in cybersecurity principles, currently pursuing Bachelor of IT in Cyber Security. Understanding of security protocols, risk assessment, and digital forensics.',
      examples: [
        'Currently studying Bachelor of IT - Cyber Security at Murdoch University',
        'Certificate III in IDMT (Cyber Security) from South Metro TAFE',
        'Implementing security best practices in business systems'
      ]
    },
    'Complaint Handling & Resolution': {
      title: 'Complaint Handling & Resolution',
      description: 'Specialized training and practical experience in crisis intervention and conflict resolution. Focus on de-escalation techniques and finding satisfactory solutions for all parties.',
      examples: [
        'Crisis Intervention and Mental Health First Aid certification',
        'Resolving complex customer service issues in retail environment',
        'Managing guest concerns in luxury hotel setting'
      ]
    }
  };

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setTimeout(() => {
      setSkillModalOpen(true);
    }, 50);
  };

  const handleSkillModalClose = () => {
    setSkillModalOpen(false);
    setTimeout(() => {
      setSelectedSkill(null);
    }, 300);
  };

  const handleEducationClick = (educationKey) => {
    setSelectedEducation(educationKey);
    setTimeout(() => {
      setEducationModalOpen(true);
    }, 50);
  };

  const handleEducationModalClose = () => {
    setEducationModalOpen(false);
    setTimeout(() => {
      setSelectedEducation(null);
    }, 300);
  };

  const handleCertificationClick = (certKey) => {
    setSelectedCertification(certKey);
    setTimeout(() => {
      setCertificationModalOpen(true);
    }, 50);
  };

  const handleCertificationModalClose = () => {
    setCertificationModalOpen(false);
    setTimeout(() => {
      setSelectedCertification(null);
    }, 300);
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    setUnitDrawerOpen(true);
  };

  const handleUnitDrawerClose = () => {
    setUnitDrawerOpen(false);
    setTimeout(() => {
      setSelectedUnit(null);
    }, 300);
  };

  const skills = ['Management & Leadership', 'Communication Skills', 'Customer Service', 'Multitasking', 'Working Under Pressure', 'System Integration', 'Cyber Security', 'Complaint Handling & Resolution'];

  return (
    <section id="about" className="content-section">
      <div className="container">
        <h2 className="section-title">Education</h2>
        <div className="experience-list">
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleEducationClick('murdoch')}>
            <div className="experience-header">
              <h3 className="experience-title">Bachelor of Information Technology - Cyber Security</h3>
              <span className="experience-period">January 2021 — Present</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">Murdoch University, Perth</p>
              </div>
              <img
                src="/company_icons/Murdoch.png"
                alt="Murdoch University"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Currently completing my Cyber Security degree part-time, with studies spanning computer systems, networking, programming, IT project management and Cyber Security. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click to view detailed coursework.</span></p>
          </div>
          
          <div className="experience-item">
            <div className="experience-header">
              <h3 className="experience-title">High School Graduate</h3>
              <span className="experience-period">November 2020</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">John Wollaston Anglican Community School, Perth</p>
              </div>
              <img
                src="/company_icons/JWACS.png"
                alt="John Wollaston Anglican Community School"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Graduated with Academic Honours for IT (highest grade in year level), three Hospitality Certifications, two Business Certifications, and Citizenship Honours for volunteering.</p>
          </div>
        </div>
        
        <h2 className="section-title" style={{ marginTop: '3rem' }}>Skills</h2>
        <div className="about-skills">
          <div 
            className="skills-grid"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '1.5rem'
            }}
          >
            {skills.map(skill =>
              <div
                key={skill}
                className="skill-item"
                style={{
                  padding: '0.75rem 1rem',
                  border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
                  borderRadius: '8px',
                  backgroundColor: hexToRgba(theme.palette.primary.main, 0.05),
                  textAlign: 'center',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#e5e7eb',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  minWidth: '180px',
                  flex: '0 0 auto'
                }}
                onClick={() => handleSkillClick(skill)}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = hexToRgba(theme.palette.primary.main, 0.6);
                  e.target.style.backgroundColor = hexToRgba(theme.palette.primary.main, 0.1);
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = hexToRgba(theme.palette.primary.main, 0.3);
                  e.target.style.backgroundColor = hexToRgba(theme.palette.primary.main, 0.05);
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {skill}
              </div>
            )}
          </div>
        </div>
        
        <h2 className="section-title" style={{ marginTop: '3rem' }}>Professional Certifications</h2>
        <div className="experience-list">
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleEducationClick('tafe-cybersecurity')}>
            <div className="experience-header">
              <h3 className="experience-title">Certificate III in IDMT (Cyber Security)</h3>
              <span className="experience-period">2019</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">South Metro TAFE</p>
              </div>
              <img
                src="/company_icons/SM_TAFE.png"
                alt="South Metro TAFE"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Advanced cybersecurity certification covering information security principles and digital forensics. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click to view detailed coursework.</span></p>
          </div>
          
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick('front-desk')}>
            <div className="experience-header">
              <h3 className="experience-title">Certified Front Desk Representative</h3>
              <span className="experience-period">April 2023</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">American Hotel & Lodging Association</p>
              </div>
              <img
                src="/company_icons/AHLA.png"
                alt="American Hotel & Lodging Association"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Professional certification in front desk operations and hospitality management. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for details.</span></p>
          </div>
          
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick('mental-health')}>
            <div className="experience-header">
              <h3 className="experience-title">Crisis Intervention and Mental Health First Aid</h3>
              <span className="experience-period">September 2023</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">Mental Health First Aid International</p>
              </div>
              <img
                src="/company_icons/MenHealFA.png"
                alt="Mental Health First Aid International"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Comprehensive training in crisis intervention techniques and mental health support strategies. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for details.</span></p>
          </div>
          
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick('cert-ii-kitchen')}>
            <div className="experience-header">
              <h3 className="experience-title">Certificate II in Kitchen Operations</h3>
              <span className="experience-period">February — December 2020</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">Hospitality Group Training (RTO)</p>
              </div>
              <img
                src="/company_icons/HGT.png"
                alt="Hospitality Group Training"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Comprehensive training in commercial kitchen operations and food safety protocols. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for details.</span></p>
          </div>
          
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick('cert-iii-business')}>
            <div className="experience-header">
              <h3 className="experience-title">Certificate III in Business</h3>
              <span className="experience-period">January — December 2020</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">Skill Strategies International (RTO)</p>
              </div>
              <img
                src="/company_icons/SkillsStrat.png"
                alt="Skill Strategies International"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Enhanced abilities in administrative tasks, customer service, and workplace communication. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for details.</span></p>
          </div>
          
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick('cert-ii-business')}>
            <div className="experience-header">
              <h3 className="experience-title">Certificate II in Business</h3>
              <span className="experience-period">January — December 2020</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">Skill Strategies International (RTO)</p>
              </div>
              <img
                src="/company_icons/SkillsStrat.png"
                alt="Skill Strategies International"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Foundational administrative skills essential for junior business roles. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for details.</span></p>
          </div>
          
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick('cert-ii-hospitality')}>
            <div className="experience-header">
              <h3 className="experience-title">Certificate II in Hospitality</h3>
              <span className="experience-period">February 2018 — December 2019</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">Hospitality Group Training (RTO)</p>
              </div>
              <img
                src="/company_icons/HGT.png"
                alt="Hospitality Group Training"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Developed operational skills for various hospitality settings including customer interaction and teamwork. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for details.</span></p>
          </div>
          
          <div className="experience-item" style={{ cursor: 'pointer' }} onClick={() => handleCertificationClick('cert-i-hospitality')}>
            <div className="experience-header">
              <h3 className="experience-title">Certificate I in Hospitality</h3>
              <span className="experience-period">February 2018 — December 2019</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between' 
            }}>
              <div>
                <p className="experience-company">Hospitality Group Training (RTO)</p>
              </div>
              <img
                src="/company_icons/HGT.png"
                alt="Hospitality Group Training"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '12px',
                  objectFit: 'contain'
                }}
              />
            </div>
            <p className="experience-description">Foundation hospitality skills including customer service, workplace safety, and hygiene practices. <span style={{ color: theme.palette.primary.main, fontWeight: '500' }}>Click for details.</span></p>
          </div>
        </div>
      </div>

      {/* Education Details Modal */}
      <Dialog
        open={educationModalOpen}
        onClose={handleEducationModalClose}
        maxWidth="lg"
        fullWidth={true}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle 
          style={{ 
            color: '#e5e7eb',
            borderBottom: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {selectedEducation && (
            <img
              src={selectedEducation === 'murdoch' ? "/company_icons/Murdoch.png" : "/company_icons/SM_TAFE.png"}
              alt={selectedEducation === 'murdoch' ? "Murdoch University" : "South Metro TAFE"}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedEducation && educationDetails[selectedEducation]?.title}
          <IconButton
            aria-label="close"
            onClick={handleEducationModalClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#9ca3af'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent style={{ padding: '1.5rem' }}>
          {selectedEducation && (
            <div>
              <Typography 
                variant="h6" 
                style={{ 
                  color: theme.palette.secondary.main, 
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}
              >
                {educationDetails[selectedEducation]?.institution}
              </Typography>
              
              <Typography 
                variant="body2" 
                style={{ 
                  color: '#9ca3af', 
                  marginBottom: '2rem'
                }}
              >
                {educationDetails[selectedEducation]?.period}
              </Typography>

              {educationDetails[selectedEducation]?.description && (
                <Typography 
                  variant="body1" 
                  style={{ 
                    color: '#e5e7eb', 
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                  }}
                >
                  {educationDetails[selectedEducation]?.description}
                </Typography>
              )}

              <Typography 
                variant="h6" 
                style={{ 
                  color: '#22c55e', 
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}
              >
                Completed Units
              </Typography>
              
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '0.75rem', 
                marginBottom: '2rem' 
              }}>
                {educationDetails[selectedEducation]?.completed.map((unit, index) => (
                  <Tooltip
                    key={index}
                    title={unitDescriptions[unit.code]}
                    arrow
                    placement="top"
                  >
                    <Chip
                      label={`${unit.code} ${unit.name}`}
                      onClick={() => handleUnitClick(unit)}
                      style={{
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        color: '#22c55e',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        fontSize: '0.75rem',
                        height: '28px',
                        cursor: 'pointer'
                      }}
                    />
                  </Tooltip>
                ))}
              </div>

              {educationDetails[selectedEducation]?.inProgress && educationDetails[selectedEducation]?.inProgress.length > 0 && (
                <>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: '#f59e0b', 
                      marginBottom: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Currently Enrolled
                  </Typography>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem' 
                  }}>
                    {educationDetails[selectedEducation]?.inProgress.map((unit, index) => (
                      <Tooltip
                        key={index}
                        title={unitDescriptions[unit.code]}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={`${unit.code} ${unit.name}`}
                          onClick={() => handleUnitClick(unit)}
                          style={{
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            color: '#f59e0b',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            fontSize: '0.75rem',
                            height: '28px',
                            cursor: 'pointer'
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Certification Details Modal */}
      <Dialog
        open={certificationModalOpen}
        onClose={handleCertificationModalClose}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle 
          style={{ 
            color: '#e5e7eb',
            borderBottom: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
            paddingBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}
        >
          {selectedCertification && (
            <img
              src={selectedCertification === 'front-desk' ? "/company_icons/AHLA.png" : 
                   selectedCertification === 'mental-health' ? "/company_icons/MenHealFA.png" :
                   (selectedCertification === 'cert-ii-business' || selectedCertification === 'cert-iii-business') ? "/company_icons/SkillsStrat.png" :
                   (selectedCertification === 'cert-i-hospitality' || selectedCertification === 'cert-ii-hospitality' || selectedCertification === 'cert-ii-kitchen') ? "/company_icons/HGT.png" : "/company_icons/AHLA.png"}
              alt={selectedCertification === 'front-desk' ? "American Hotel & Lodging Association" : 
                   selectedCertification === 'mental-health' ? "Mental Health First Aid International" :
                   (selectedCertification === 'cert-ii-business' || selectedCertification === 'cert-iii-business') ? "Skill Strategies International" :
                   (selectedCertification === 'cert-i-hospitality' || selectedCertification === 'cert-ii-hospitality' || selectedCertification === 'cert-ii-kitchen') ? "Hospitality Group Training" : "American Hotel & Lodging Association"}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                objectFit: 'contain'
              }}
            />
          )}
          {selectedCertification && certificationDetails[selectedCertification]?.title}
          <IconButton
            aria-label="close"
            onClick={handleCertificationModalClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#9ca3af'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent style={{ padding: '1.5rem' }}>
          {selectedCertification && (
            <div>
              <Typography 
                variant="h6" 
                style={{ 
                  color: theme.palette.primary.main, 
                  marginBottom: '0.5rem',
                  fontWeight: '600'
                }}
              >
                {certificationDetails[selectedCertification]?.organization}
              </Typography>
              
              <Typography 
                variant="body2" 
                style={{ 
                  color: '#9ca3af', 
                  marginBottom: '1.5rem'
                }}
              >
                {certificationDetails[selectedCertification]?.period}
              </Typography>

              <Typography 
                variant="body1" 
                style={{ 
                  color: '#e5e7eb', 
                  lineHeight: '1.6',
                  marginBottom: certificationDetails[selectedCertification]?.units ? '2rem' : '0'
                }}
              >
                {certificationDetails[selectedCertification]?.description}
              </Typography>

              {certificationDetails[selectedCertification]?.units && (
                <>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: '#22c55e', 
                      marginBottom: '1rem',
                      fontWeight: '600'
                    }}
                  >
                    Completed Units
                  </Typography>
                  
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '0.75rem'
                  }}>
                    {certificationDetails[selectedCertification]?.units.map((unit, index) => (
                      <Tooltip
                        key={index}
                        title={unitDescriptions[unit.code]}
                        arrow
                        placement="top"
                      >
                        <Chip
                          label={`${unit.code} ${unit.name}`}
                          onClick={() => handleUnitClick(unit)}
                          style={{
                            backgroundColor: 'rgba(34, 197, 94, 0.1)',
                            color: '#22c55e',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            fontSize: '0.75rem',
                            height: '28px',
                            cursor: 'pointer'
                          }}
                        />
                      </Tooltip>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Unit Details Drawer */}
      <Drawer
        anchor="right"
        open={unitDrawerOpen}
        onClose={handleUnitDrawerClose}
        style={{ zIndex: 9999 }}
        PaperProps={{
          style: {
            width: '400px',
            backgroundColor: '#1a1a1a',
            border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
            borderRadius: '12px 0 0 12px',
            zIndex: 9999
          }
        }}
      >
        <Box 
          role="presentation" 
          style={{ 
            padding: '1.5rem',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {selectedUnit && (
            <>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1.5rem',
                borderBottom: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
                paddingBottom: '1rem'
              }}>
                <div>
                  <Typography 
                    variant="h5" 
                    style={{ 
                      color: theme.palette.secondary.main,
                      fontWeight: '700',
                      marginBottom: '0.5rem'
                    }}
                  >
                    {selectedUnit.code}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    style={{ 
                      color: '#e5e7eb',
                      fontWeight: '600',
                      lineHeight: '1.3'
                    }}
                  >
                    {selectedUnit.name}
                  </Typography>
                </div>
                <IconButton
                  onClick={handleUnitDrawerClose}
                  style={{
                    color: '#9ca3af',
                    padding: '8px'
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </div>

              <div style={{ flex: 1 }}>
                <Typography 
                  variant="body1" 
                  style={{ 
                    color: '#e5e7eb',
                    lineHeight: '1.6',
                    fontSize: '1rem'
                  }}
                >
                  {unitDescriptions[selectedUnit.code]}
                </Typography>
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: hexToRgba(theme.palette.primary.main, 0.05),
                border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
                borderRadius: '8px'
              }}>
                <Typography 
                  variant="body2" 
                  style={{ 
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                    fontStyle: 'italic'
                  }}
                >
                  Click outside or press the × to close this panel
                </Typography>
              </div>
            </>
          )}
        </Box>
      </Drawer>

      {/* Skill Details Modal */}
      <Dialog
        open={skillModalOpen}
        onClose={handleSkillModalClose}
        maxWidth="md"
        fullWidth={true}
        PaperProps={{
          style: {
            backgroundColor: '#1a1a1a',
            border: `1px solid ${hexToRgba(theme.palette.primary.main, 0.3)}`,
            borderRadius: '12px'
          }
        }}
      >
        <DialogTitle 
          style={{ 
            color: '#e5e7eb',
            borderBottom: `1px solid ${hexToRgba(theme.palette.primary.main, 0.2)}`,
            paddingBottom: '1rem'
          }}
        >
          {selectedSkill && skillDetails[selectedSkill]?.title}
          <IconButton
            aria-label="close"
            onClick={handleSkillModalClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: '#9ca3af'
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent style={{ padding: '1.5rem' }}>
          {selectedSkill && (
            <div>
              <Typography 
                variant="body1" 
                style={{ 
                  color: '#e5e7eb', 
                  marginBottom: '1.5rem',
                  lineHeight: '1.6'
                }}
              >
                {skillDetails[selectedSkill]?.description}
              </Typography>
              
              <Typography 
                variant="h6" 
                style={{ 
                  color: theme.palette.secondary.main, 
                  marginBottom: '1rem',
                  fontWeight: '600'
                }}
              >
                Key Examples:
              </Typography>
              
              <ul style={{ 
                color: '#e5e7eb', 
                paddingLeft: '1.5rem',
                lineHeight: '1.6'
              }}>
                {skillDetails[selectedSkill]?.examples.map((example, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default AboutSection; 