import {
  ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, Input, NgZone, OnDestroy,
  OnInit, Optional, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation
} from '@angular/core';
import { App, Config, DeepLinker, DomController, GestureController, NavControllerBase, NavOptions, Platform } from 'ionic-angular';
import { TransitionController } from 'ionic-angular/transitions/transition-controller';
import { SuperTabs } from './super-tabs';
import { ErrorHandler } from '@angular/core';

@Component({
  selector: 'ion-super-tab',
  template: '<div #viewport></div><div class="nav-decor"></div>',
  encapsulation: ViewEncapsulation.None
})
export class SuperTab extends NavControllerBase implements OnInit, OnDestroy {
  @Input()
  title: string;

  get tabTitle() {
    return this.title;
  }

  get index() {
    return this.parent.getTabIndexById(this.tabId);
  }

  @Input()
  icon: string;

  /**
   * @input {Page} Set the root page for this tab.
   */
  @Input() root: any;

  /**
   * @input {object} Any nav-params to pass to the root page of this tab.
   */
  @Input() rootParams: any;

  @Input('id')
  tabId: string;

  get _tabId() {
    return this.tabId;
  }

  @Input()
  badge: number;

  @Input()
  get swipeBackEnabled(): boolean {
    return this._sbEnabled;
  }

  set swipeBackEnabled(val: boolean) {
    this._sbEnabled = !!val;
    this._swipeBackCheck();
  }

  private loaded: boolean = false;

  /**
   * @hidden
   */
  @ViewChild('viewport', { read: ViewContainerRef })
  set _vp(val: ViewContainerRef) {
    this.setViewport(val);
  }

  constructor(
    parent: SuperTabs,
    app: App,
    config: Config,
    plt: Platform,
    el: ElementRef,
    zone: NgZone,
    rnd: Renderer,
    cfr: ComponentFactoryResolver,
    gestureCtrl: GestureController,
    transCtrl: TransitionController,
    @Optional() linker: DeepLinker,
    private _dom: DomController,
    errHandler: ErrorHandler,
    private cd: ChangeDetectorRef
  ) {
    super(parent, app, config, plt, el, zone, rnd, cfr, gestureCtrl, transCtrl, linker, _dom, errHandler);
  }

  ngOnInit() {
    this.parent.addTab(this);
  }

  load(): Promise<void> {
    if (this.loaded) {
      this._dom.read(() => {
        this.resize();
      });
      return Promise.resolve();
    }

    return this.push(this.root, this.rootParams, { animate: false }).then(() => {
      this.loaded = true;
      this._dom.read(() => {
        this.resize();
      });
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  setActive(active: boolean) {
    if (active) {
      this.cd.reattach();
      this.cd.detectChanges();
      return;
    }

    this.cd.detach();
  }

  setBadge(value: number) {
    this.badge = value;
  }

  clearBadge() {
    delete this.badge;
  }

  increaseBadge(increaseBy: number = 1) {
    this.badge += increaseBy;
  }

  decreaseBadge(decreaseBy: number = 1) {
    this.badge = Math.max(0, this.badge - decreaseBy);
  }

  setWidth(width: number) {
    this.setElementStyle('width', width + 'px');
  }

  goToRoot(opts: NavOptions): Promise<any> {
    return this.setRoot(this.root, this.rootParams, opts, null);
  }
}
