export const initialCategories = [
  {
    name: 'Computer Science & AI',
    code: 'CS-AI',
    description: 'Neural networks, autonomous systems, quantum algorithms, and software engineering.',
    icon: 'Cpu',
    color: 'from-blue-500 to-cyan-400'
  },
  {
    name: 'Quantum Physics',
    code: 'Q-PHYS',
    description: 'Quantum mechanics, particle dynamics, string theory, and astrophysics.',
    icon: 'Atom',
    color: 'from-purple-500 to-indigo-400'
  },
  {
    name: 'Cybersecurity & Cryptography',
    code: 'SEC-CRYPTO',
    description: 'Zero-knowledge proofs, post-quantum cryptography, and network defense.',
    icon: 'Shield',
    color: 'from-emerald-500 to-teal-400'
  },
  {
    name: 'Futuristic Architecture & Design',
    code: 'ARCH-DES',
    description: 'Biophilic cities, modular habitats, orbital design, and parametric architecture.',
    icon: 'Layers',
    color: 'from-pink-500 to-rose-400'
  },
  {
    name: 'Bio-Engineering & Genetics',
    code: 'BIO-GEN',
    description: 'CRISPR systems, synthetic biology, neural interfaces, and longevity medicine.',
    icon: 'Dna',
    color: 'from-amber-500 to-orange-400'
  },
  {
    name: 'Philosophy of Mind & Ethics',
    code: 'PHIL-ETH',
    description: 'Consciousness theories, machine ethics, epistemology, and post-humanist studies.',
    icon: 'Sparkles',
    color: 'from-violet-500 to-purple-400'
  }
];

export const initialBooks = [
  {
    title: 'Architectures of Machine Intelligence',
    author: 'Dr. Evelyn Vance & K. Nakamoto',
    isbn: '978-0-13-468599-1',
    category: 'Computer Science & AI',
    publisher: 'MIT Quantum Press',
    publicationYear: 2025,
    description: 'A comprehensive study on transformer architectures, attention mechanisms, and deep reinforcement learning in neuromorphic silicon architectures.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    totalCopies: 12,
    availableCopies: 9,
    shelfLocation: 'Section A - Bay 04',
    rating: 4.9,
    pages: 540,
    tags: ['AI', 'Transformers', 'Neuromorphic', 'Deep Learning']
  },
  {
    title: 'Quantum Field Theory in Curved Spacetime',
    author: 'Prof. Marcus Holloway',
    isbn: '978-0-19-853409-8',
    category: 'Quantum Physics',
    publisher: 'Oxford Academic Press',
    publicationYear: 2024,
    description: 'Rigorous exploration of Hawking radiation, vacuum polarization in gravitational fields, and unification paradigms.',
    coverImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    totalCopies: 8,
    availableCopies: 6,
    shelfLocation: 'Section B - Bay 02',
    rating: 4.8,
    pages: 420,
    tags: ['Physics', 'Quantum', 'Cosmology']
  },
  {
    title: 'Zero-Knowledge Cryptography: Protocols & Systems',
    author: 'Sora Tanaka & Dr. Lucas Wright',
    isbn: '978-1-49-195438-6',
    category: 'Cybersecurity & Cryptography',
    publisher: "O'Reilly Advanced Media",
    publicationYear: 2025,
    description: 'From zk-SNARKs and zk-STARKs to lattice-based post-quantum key exchanges and private distributed ledgers.',
    coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=600&q=80',
    totalCopies: 10,
    availableCopies: 8,
    shelfLocation: 'Section C - Bay 01',
    rating: 4.95,
    pages: 480,
    tags: ['Crypto', 'Security', 'ZeroKnowledge']
  },
  {
    title: 'Synthetic Neural Interfaces',
    author: 'Elena Rostova',
    isbn: '978-0-262-03876-8',
    category: 'Bio-Engineering & Genetics',
    publisher: 'Biophilic Press',
    publicationYear: 2024,
    description: 'Direct cortical interfaces, biocompatible graphene matrices, and synaptic signal decoding algorithms.',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=600&q=80',
    totalCopies: 6,
    availableCopies: 4,
    shelfLocation: 'Section D - Bay 03',
    rating: 4.7,
    pages: 360,
    tags: ['BioTech', 'Neuroscience', 'BCI']
  },
  {
    title: 'Parametric Skylines: Habitats of the 22nd Century',
    author: 'Julian Moreau & Zara Al-Mansoor',
    isbn: '978-3-7913-8472-1',
    category: 'Futuristic Architecture & Design',
    publisher: 'Prestel Spatial Lab',
    publicationYear: 2025,
    description: 'Explorations in kinetic facades, generative architectural algorithms, self-healing concrete, and orbital living pods.',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80',
    totalCopies: 7,
    availableCopies: 5,
    shelfLocation: 'Section E - Bay 05',
    rating: 4.85,
    pages: 310,
    tags: ['Design', 'Architecture', 'Parametric']
  },
  {
    title: 'The Sentient Horizon: Ethics of Artificial Consciousness',
    author: 'Aria Thorne, Ph.D.',
    isbn: '978-0-691-18231-5',
    category: 'Philosophy of Mind & Ethics',
    publisher: 'Princeton University Press',
    publicationYear: 2024,
    description: 'A groundbreaking ethical framework addressing rights of autonomous synthetic entities, consciousness verification tests, and collective agency.',
    coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
    totalCopies: 14,
    availableCopies: 11,
    shelfLocation: 'Section F - Bay 02',
    rating: 4.9,
    pages: 290,
    tags: ['Philosophy', 'Ethics', 'Consciousness']
  },
  {
    title: 'Distributed Consensus & Fault Tolerant Systems',
    author: 'Leslie Lamport & Kenji Sato',
    isbn: '978-0-13-110362-7',
    category: 'Computer Science & AI',
    publisher: 'Pearson Advanced Tech',
    publicationYear: 2023,
    description: 'Paxos, Raft, Byzantine fault tolerance, vector clocks, and global clock synchronization in distributed microsecond topologies.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    totalCopies: 9,
    availableCopies: 7,
    shelfLocation: 'Section A - Bay 01',
    rating: 4.88,
    pages: 512,
    tags: ['Distributed', 'Consensus', 'Scale']
  },
  {
    title: 'High-Dimensional Topology and Manifolds',
    author: 'Cyril Delacroix',
    isbn: '978-0-8218-4361-9',
    category: 'Quantum Physics',
    publisher: 'American Mathematical Society',
    publicationYear: 2024,
    description: 'Differential geometry on Calabi-Yau manifolds, Ricci curvature flows, and topological quantum invariants.',
    coverImage: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
    totalCopies: 5,
    availableCopies: 4,
    shelfLocation: 'Section B - Bay 05',
    rating: 4.75,
    pages: 395,
    tags: ['Mathematics', 'Geometry', 'Topology']
  }
];

export const initialStudents = [
  {
    name: 'Aiden Vance',
    email: 'student@library.com',
    password: 'student123',
    role: 'student',
    studentId: 'STU-2026-001',
    department: 'Artificial Intelligence & Robotics',
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
    status: 'active'
  },
  {
    name: 'Seraphina Chen',
    email: 'seraphina.chen@campus.edu',
    password: 'student123',
    role: 'student',
    studentId: 'STU-2026-002',
    department: 'Quantum Information Science',
    phone: '+1 (555) 345-6789',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    status: 'active'
  },
  {
    name: 'Marcus Sterling',
    email: 'marcus.sterling@campus.edu',
    password: 'student123',
    role: 'student',
    studentId: 'STU-2026-003',
    department: 'Cybersecurity Architecture',
    phone: '+1 (555) 456-7890',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
    status: 'active'
  },
  {
    name: 'Layla Al-Mansoor',
    email: 'layla.mansoor@campus.edu',
    password: 'student123',
    role: 'student',
    studentId: 'STU-2026-004',
    department: 'Biotechnology & Synthetic Genetics',
    phone: '+1 (555) 567-8901',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
    status: 'active'
  }
];

export const initialAdmin = {
  name: 'Director Cassandra Cross',
  email: 'admin@library.com',
  password: 'admin123',
  role: 'admin',
  department: 'Library Systems Administration',
  phone: '+1 (555) 999-0000',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  status: 'active'
};
