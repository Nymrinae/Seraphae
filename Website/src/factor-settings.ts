export default {
  metatags: {
    titleTemplate: 'Seraphae',
  },
  site: {
    logo: () => import('./components/Logo.vue'),
    nav: [
      { _item: 'home', path: '/', name: 'Home' },
      { _item: 'about', path: '/about', name: 'About' },
      { _item: 'updates', path: '/blog', name: 'Updates' },
      { _item: 'support', path: '/support', name: 'Support' }
    ],
    social: [
      { _item: 'discord', path: 'https://discord.com/api/oauth2/authorize?client_id=708752020550451310&permissions=0&scope=bot', icon: 'fab fa-discord' },
      { _item: 'twitter', path: 'https://twitter.com/nymrinae', icon: 'fab fa-twitter' },
      { _item: 'github', path: 'https://github.com/Nymrinae/Seraphae', icon: 'fab fa-github' },
    ],
    cta: {
      headline: 'Don\'t hesitate! Add Seraphae now!',
      path: 'https://discord.com/api/oauth2/authorize?client_id=708752020550451310&permissions=0&scope=bot',
      text: 'Invite'
    }
  },
  footer: {
    legal: `&copy; 2020 Nymrinae`,
    nav: [],
  },
  home: {
    intro: {
      pretitle: '',
      title: 'Seraphae <br> Multi-purpose Discord Bot.',
      content: '',
      buttons: [{
        _item: 'contact',
        link: 'https://discord.com/api/oauth2/authorize?client_id=708752020550451310&permissions=0&scope=bot',
        text: `<i class='fab fa-discord' style='margin-right: 12px'></i> Add to your server !`,
        classes:
          'btn rounded-full bg-blue-500 text-white hover:bg-blue-700 hover:text-white pr-4',
      }]
    },
    section2: {
      id: 'services',
      pretitle: '',
      title: 'Features',
      items: [
        {
          icon: require('./assets/user-shield-solid.svg'),
          title: 'Manage your server',
          content: 'Logs system included, with no configuration needed. Mute, kick, ban users with or without a reason.',
        },
        {
          icon: require('./assets/dice-solid.svg'),
          title: 'Play with your friends',
          content: 'Fresh new games added such as RockPaperScissors, TicTacToe, Connect4 and more...',
        },
        {
          icon: require('./assets/walking-solid.svg'),
          title: 'Build your character',
          content: `Complete RPG System : earn golds, spend golds.`,
        },
        {
          icon: require('./assets/star-solid.svg'),
          title: 'Have fun with utilities commands',
          content: 'A lot of utilities commands',
        }
      ]
    },
    section3: {
      pretitle: '',
      title: '',
      buttons: []
    },
    section4: {
      component: () => import('./views/Empty.vue')
    },
    section5: {
      component: () => import('./views/Empty.vue')
    },
  }
}