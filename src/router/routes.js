export default [
  {
    path: '/',
    name: 'Home',
    redirect: '/bmd-synoptic',
    meta: { title: 'CIMMYT-Bangladesh Data Hub' }
  },
  {
    path: '/bmd-synoptic',
    name: 'BmdSynoptic',
    redirect: '/bmd-synoptic/week-wise-heatmap',
    component: () => import('../pages/BmdSynoptic.vue'),
    meta: { title: 'BMD Synoptic Station Data', color: 'green' },
    children: [
      {
        path: 'week-wise-heatmap',
        name: 'BmdSynopticWeekWiseHeatmap',
        component: () => import('../pages/bmd-synoptic/TabWeekWiseHeatmap.vue'),
        meta: { title: 'BMD Synoptic Station Data', color: 'green' }
      },
      {
        path: 'calendar-heatmap',
        name: 'BmdSynopticCalendarHeatmap',
        component: () => import('../pages/bmd-synoptic/TabCalendarHeatmap.vue'),
        meta: { title: 'BMD Synoptic Station Data', color: 'green' }
      }
    ]
  },
  {
    path: '/bmd-forecast',
    name: 'BmdForecast',
    redirect: '/bmd-forecast/tab-1',
    component: () => import('../pages/BmdForecast.vue'),
    meta: { title: 'BMD Forecast Data', color: 'blue' },
    children: [
      {
        path: 'tab-1',
        name: 'BmdForecastTab1',
        component: () => import('../pages/bmd-forecast/Tab1.vue'),
        meta: { title: 'BMD Forecast Data', color: 'blue' }
      },
      {
        path: 'tab-2',
        name: 'BmdForecastTab2',
        component: () => import('../pages/bmd-forecast/Tab2.vue'),
        meta: { title: 'BMD Forecast Data', color: 'blue' }
      }
    ]
  },
  {
    path: '/fall-armyworm',
    name: 'FallArmyworm',
    component: () => import('../pages/FallArmyworm.vue'),
    meta: { title: 'Fall Armyworm Monitoring', color: 'orange' }
  }
]
