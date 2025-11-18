export const feedData = [
  {
    id: '1',
    type: 'video',
    contentUrl: 'https://example.com/video1.mp4',
    creator: {
      id: 'user1',
      name: 'FashionGuru',
      avatar: 'https://example.com/avatar1.jpg',
      verified: true,
      followers: 125000,
    },
    product: {
      id: 'prod1',
      name: 'Designer Summer Dress',
      price: 89.99,
      originalPrice: 129.99,
      image: 'https://example.com/dress.jpg',
    },
    likes: 2456,
    comments: 189,
    shares: 456,
    caption:
      'This dress is perfect for summer outings! So comfortable and stylish. #fashion #summer',
    sound: 'Original Sound - FashionGuru',
    hashtags: ['#fashion', '#summer', '#ootd'],
    created_at: '2 hours ago',
    commentsList: [
      {
        id: 'c1',
        user: {
          id: 'user5',
          name: 'StyleLover',
          avatar: 'https://example.com/avatar5.jpg',
        },
        comment: 'Love this! Where can I get it?',
        likes: 23,
        created_at: '1 hour ago',
      },
      {
        id: 'c2',
        user: {
          id: 'user6',
          name: 'FashionExpert',
          avatar: 'https://example.com/avatar6.jpg',
        },
        comment: 'The color looks amazing on you!',
        likes: 15,
        created_at: '45 minutes ago',
      },
    ],



  },
    {
        id: '2',
        type: 'image',
        contentUrl: 'https://example.com/image1.jpg',
        creator: {
        id: 'user2',
        name: 'TechSavvy',
        avatar: 'https://example.com/avatar2.jpg',
        verified: false,
        followers: 54000,
        },
        product: {
        id: 'prod2',
        name: 'Wireless Earbuds',
        price: 59.99,
        originalPrice: 79.99,
        image: 'https://example.com/earbuds.jpg',
        },
        likes: 1345,
        comments: 98,
        shares: 210,
        caption:
        'These earbuds have the best sound quality I\'ve ever experienced! #tech #gadgets',
        sound: 'Original Sound - TechSavvy',
        hashtags: ['#tech', '#gadgets', '#wireless'],
        created_at: '5 hours ago',
        commentsList: [
        {
            id: 'c3',
            user: {
            id: 'user7',
            name: 'GadgetFan',
            avatar: 'https://example.com/avatar7.jpg',
            },
            comment: 'Thinking of buying these, are they worth it?',
            likes: 10,
            created_at: '4 hours ago',
        },
        {
            id: 'c4',
            user: {
            id: 'user8',
            name: 'MusicLover',
            avatar: 'https://example.com/avatar8.jpg',
            },
            comment: 'How\'s the battery life?',
            likes: 8,
            created_at: '3 hours ago',
        },
        ],
    },
    
  // ... more feed data
]
