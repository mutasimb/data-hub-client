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
    component: () => import('../components/BmdKobo/Index.vue'),
    meta: { title: 'BMD Synoptic Station Data', color: 'green' },
    children: [
      {
        path: 'week-wise-heatmap',
        name: 'BmdSynopticWeekWiseHeatmap',
        component: () => import('../components/BmdKobo/TabWeekWiseHeatmap.vue'),
        meta: { title: 'BMD Synoptic Station Data', color: 'green' }
      },
      {
        path: 'calendar-heatmap',
        name: 'BmdSynopticCalendarHeatmap',
        component: () => import('../components/BmdKobo/TabCalendarHeatmap.vue'),
        meta: { title: 'BMD Synoptic Station Data', color: 'green' }
      }
    ]
  },
  {
    path: '/bmd-forecast',
    name: 'BmdForecast',
    redirect: '/bmd-forecast/tab-1',
    component: () => import('../components/BmdForecast/Index.vue'),
    meta: { title: 'BMD Forecast Data', color: 'blue' },
    children: [
      {
        path: 'tab-1',
        name: 'BmdForecastTab1',
        component: () => import('../components/BmdForecast/Tab1.vue'),
        meta: { title: 'BMD Forecast Data', color: 'blue' }
      },
      {
        path: 'tab-2',
        name: 'BmdForecastTab2',
        component: () => import('../components/BmdForecast/Tab2.vue'),
        meta: { title: 'BMD Forecast Data', color: 'blue' }
      }
    ]
  },
  {
    path: '/fall-armyworm',
    name: 'FallArmyworm',
    component: () => import('../components/FallArmyworm/Index.vue'),
    meta: { title: 'Fall Armyworm Monitoring', color: 'orange' }
  }
]
