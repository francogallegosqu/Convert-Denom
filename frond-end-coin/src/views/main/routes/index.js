export default [
  {
    path: '/home/metamask',
    name: 'app-metamask',
    meta: {
      layout: 'full',
    },
    component: () => import('../Home.vue'),
  },
]
