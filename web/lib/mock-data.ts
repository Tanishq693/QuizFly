import { Quiz } from './types';

export const MOCK_QUIZZES: Quiz[] = [
  {
    id: 'transformers-deep-dive',
    title: 'Attention Is All You Need: Transformer Architecture Essentials',
    sourceUrl: 'https://arxiv.org/abs/1706.03762',
    sourceDomain: 'arxiv.org',
    category: 'AI & ML',
    timeAgo: '2h ago',
    avgScore: 84,
    estMinutes: 4,
    createdAt: '2026-09-19T18:00:00Z',
    questions: [
      {
        id: 'q1',
        prompt: 'What key mechanism allows Transformer models to draw global dependencies between input and output without relying on recurrent sequence-aligned RNNs?',
        options: [
          { id: 'opt1', text: 'Multi-Head Self-Attention mechanism' },
          { id: 'opt2', text: 'Convolutions with large kernel strides' },
          { id: 'opt3', text: 'Gradient boosted recurrence blocks' },
          { id: 'opt4', text: 'Backpropagation through time (BPTT)' }
        ],
        correctOptionId: 'opt1',
        sourceQuote: 'The Transformer is the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention.',
        quoteLocation: 'Section 1: Introduction, Paragraph 3'
      },
      {
        id: 'q2',
        prompt: 'Why are Positional Encodings added to the input embeddings in the Transformer architecture?',
        options: [
          { id: 'opt1', text: 'To compress the hidden state dimensions' },
          { id: 'opt2', text: 'To inject sequence order information since the model contains no recurrence or convolution' },
          { id: 'opt3', text: 'To scale dot-product attention scores by square root of d_k' },
          { id: 'opt4', text: 'To prevent vanishing gradients in deep encoder layers' }
        ],
        correctOptionId: 'opt2',
        sourceQuote: 'Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens.',
        quoteLocation: 'Section 3.5: Positional Encoding'
      },
      {
        id: 'q3',
        prompt: 'What scaling factor is used in Scaled Dot-Product Attention to prevent softmax gradients from becoming extremely small for large vector dimensions?',
        options: [
          { id: 'opt1', text: 'Dividing by the hidden batch size N' },
          { id: 'opt2', text: 'Dividing the dot product by √d_k (square root of key dimension)' },
          { id: 'opt3', text: 'Multiplying by the learning rate hyperparameter' },
          { id: 'opt4', text: 'Subtracting the maximum key vector norm' }
        ],
        correctOptionId: 'opt2',
        sourceQuote: 'We compute the dot products of the query with all keys, divide each by √d_k, and apply a softmax function to obtain the weights on the values.',
        quoteLocation: 'Section 3.2.1: Scaled Dot-Product Attention'
      }
    ]
  },
  {
    id: 'react-server-components',
    title: 'React Server Components: Architecture & Data Fetching Patterns',
    sourceUrl: 'https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023',
    sourceDomain: 'react.dev',
    category: 'Web Dev',
    timeAgo: '5h ago',
    avgScore: 78,
    estMinutes: 3,
    createdAt: '2026-09-19T15:00:00Z',
    questions: [
      {
        id: 'r1',
        prompt: 'Where do React Server Components (RSC) execute and how do they impact client bundle size?',
        options: [
          { id: 'opt1', text: 'They execute on the client browser and increase bundle size' },
          { id: 'opt2', text: 'They execute strictly on the server and send zero client-side JavaScript for their dependencies' },
          { id: 'opt3', text: 'They re-render on every client state change via WebSocket connections' },
          { id: 'opt4', text: 'They compile directly to WebAssembly client modules' }
        ],
        correctOptionId: 'opt2',
        sourceQuote: 'Server Components run only on the server and have no impact on bundle size. Their code is never downloaded to the client, helping keep initial loads fast.',
        quoteLocation: 'React Docs: Server Components Deep Dive'
      },
      {
        id: 'r2',
        prompt: 'Which directive must be added to the top of a file in Next.js App Router to convert a Server Component into an interactive Client Component?',
        options: [
          { id: 'opt1', text: '"use server"' },
          { id: 'opt2', text: '"use client"' },
          { id: 'opt3', text: '"use interactive"' },
          { id: 'opt4', text: '"use state"' }
        ],
        correctOptionId: 'opt2',
        sourceQuote: 'The "use client" directive is a convention to declare a boundary between a Server and Client Component module graph.',
        quoteLocation: 'Next.js Routing Fundamentals: Directives'
      }
    ]
  },
  {
    id: 'neuroscience-active-recall',
    title: 'Neuroscience of Active Recall & Spaced Repetition Memory Retention',
    sourceUrl: 'https://nature.com/articles/neuro-memory-retention-2025',
    sourceDomain: 'nature.com',
    category: 'Neuroscience',
    timeAgo: '1d ago',
    avgScore: 91,
    estMinutes: 5,
    createdAt: '2026-09-18T10:00:00Z',
    questions: [
      {
        id: 'n1',
        prompt: 'Why does Active Retrieval (testing oneself) produce stronger long-term neural synaptic plasticity compared to passive re-reading?',
        options: [
          { id: 'opt1', text: 'Passive reading causes synaptic pruning in the occipital lobe' },
          { id: 'opt2', text: 'Active retrieval forces the brain to reconstruct memory traces, strengthening hippocampal-cortical neural pathways' },
          { id: 'opt3', text: 'Active retrieval lowers dopamine levels to increase focus' },
          { id: 'opt4', text: 'Re-reading engages prefrontal cortex motor planning functions' }
        ],
        correctOptionId: 'opt2',
        sourceQuote: 'Testing memory forces neural reactivation of memory pathways. Every successful retrieval alters the memory trace, making it more resistant to memory decay.',
        quoteLocation: 'Nature Neuroscience: Synaptic Consolidation, Page 14'
      },
      {
        id: 'n2',
        prompt: 'What cognitive phenomenon describes why feeling "friction" or effort during retrieval leads to stronger memory consolidation?',
        options: [
          { id: 'opt1', text: 'Desirable Difficulty Effect' },
          { id: 'opt2', text: 'Ebbinghaus Primacy Bias' },
          { id: 'opt3', text: 'Cognitive Dissonance Shift' },
          { id: 'opt4', text: 'Working Memory Saturation' }
        ],
        correctOptionId: 'opt1',
        sourceQuote: 'Conditions that trigger cognitive effort during learning—known as desirable difficulties—enhance long-term retention even if immediate performance feels slower.',
        quoteLocation: 'Section 4: The Role of Retrieval Friction'
      }
    ]
  },
  {
    id: 'system-design-distributed-locks',
    title: 'Distributed Locks & Consensus: Redlock Algorithm vs Raft',
    sourceUrl: 'https://redis.io/topics/distlock',
    sourceDomain: 'redis.io',
    category: 'System Design',
    timeAgo: '2d ago',
    avgScore: 72,
    estMinutes: 6,
    createdAt: '2026-09-17T14:30:00Z',
    questions: [
      {
        id: 's1',
        prompt: 'In distributed systems, what is the primary purpose of setting a TTL (Time To Live) on a distributed lock key?',
        options: [
          { id: 'opt1', text: 'To speed up Redis key indexing algorithms' },
          { id: 'opt2', text: 'To prevent deadlocks if the lock holder crashes before explicitly releasing the lock' },
          { id: 'opt3', text: 'To ensure all read requests bypass write-ahead logs' },
          { id: 'opt4', text: 'To force automatic leader re-election across quorum nodes' }
        ],
        correctOptionId: 'opt2',
        sourceQuote: 'The lock lease time or TTL guarantees that even if a client crashes while holding the lock, the lock will eventually expire automatically allowing other workers to proceed.',
        quoteLocation: 'Distributed Locks with Redis: Safety Guarantees'
      }
    ]
  }
];
