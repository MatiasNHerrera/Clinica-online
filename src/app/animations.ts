import { trigger, transition, style, query, group, animateChild, animate } from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimations', [
    transition('Login => Usuario', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({ top: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('1000ms ease-out', style({ top: '100%'}))
        ]),
        query(':enter', [
          animate('1000ms ease-out', style({ top: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Usuario => Login', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({ right: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('1000ms ease-out', style({ right: '100%'}))
        ]),
        query(':enter', [
          animate('1000ms ease-out', style({ right: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Principal => Login', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({ transform: 'translateY(1000px)'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('1000ms ease-out', style({transform: 'translateY(-1000px)'}))
        ]),
        query(':enter', [
          animate('1000ms ease-out', style({ transform: 'translateY(0px)'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Principal => Usuario', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({transform: 'translateY(1000px)'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('1000ms ease-out', style({transform: 'translateY(-1000px)'}))
        ]),
        query(':enter', [
          animate('1000ms ease-out', style({ transform: 'translateY(0px)'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Gestion => Principal', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({top: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('1000ms ease-out', style({top: '100%'}))
        ]),
        query(':enter', [
          animate('1000ms ease-out', style({ top: '0'}))
        ])
      ]),
      query(':enter', animateChild()),
    ]),
    transition('Atender => Principal', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          right: 0,
          width: '100%',
          height: '100%'
        })
      ]),
      query(':enter', [
        style({top: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('1000ms ease-out', style({top: '100%'}))
        ]),
        query(':enter', [
          animate('1000ms ease-out', style({top: '0'}))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);