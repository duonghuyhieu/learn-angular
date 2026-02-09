import { Injectable, signal, computed } from '@angular/core';
import { Lesson } from '../models/knowledge.model';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {

  private _lessonsData: Lesson[] = [
    // === BASICS ===
    {
      id: 'basics',
      title: 'Angular Core Concepts',
      category: 'basics',
      icon: '📚',
      sections: [
        {
          title: 'Angular là gì?',
          content: `**Angular** là một **full-featured framework** để xây dựng single-page applications (SPA), được phát triển bởi Google.

**Tại sao chọn Angular?**
- **Opinionated**: Có cấu trúc rõ ràng, team dễ follow conventions
- **TypeScript First**: Static typing, IntelliSense tốt
- **Full Package**: Router, Forms, HTTP, Testing đều built-in
- **Enterprise Ready**: Dùng cho large-scale applications

**Angular vs React vs Vue:**
| Aspect | Angular | React | Vue |
|--------|---------|-------|-----|
| Type | Framework | Library | Progressive |
| Language | TypeScript | JavaScript/TS | JavaScript/TS |
| DOM | Direct manipulation | Virtual DOM | Virtual DOM |
| Learning Curve | Steep | Medium | Gentle |
| Best For | Enterprise apps | Flexible projects | Rapid prototyping |`,
          code: {
            language: 'bash',
            filename: 'Getting Started',
            code: `# Cài đặt Angular CLI
npm install -g @angular/cli

# Tạo project mới
ng new my-app --style=scss --routing=true

# Chạy development server
cd my-app
ng serve --open

# Generate component
ng generate component components/header
# hoặc shorthand: ng g c components/header`
          },
          tips: [
            'Angular 17+ là phiên bản khuyên dùng - standalone by default',
            'Dùng --dry-run để preview những gì sẽ được tạo',
            'Có thể dùng Angular Universal cho Server-Side Rendering'
          ]
        },
        {
          title: 'Kiến trúc Angular (Deep Dive)',
          content: `**Tại sao Angular được thiết kế như vậy?**

Angular là **opinionated framework** - nó enforce một kiến trúc cụ thể. Điều này khác với React (library) hay Vue (progressive).

**Core architectural decisions:**
- **Ivy Compiler**: Template → JavaScript instructions. Không dùng Virtual DOM như React, mà generate code trực tiếp manipulate DOM
- **Zone.js**: Monkey-patch async APIs để auto-trigger change detection. Trade-off: magic nhưng có performance cost
- **Hierarchical DI**: Injector tree song song với component tree. Cho phép scope services theo subtree
- **Decorator-based metadata**: @Component, @Injectable dùng reflect-metadata để store config tại runtime

**Angular 17+ breaking changes:**
- Standalone by default: Không cần NgModule, giảm boilerplate
- Signals: Fine-grained reactivity, có thể bypass Zone.js
- Control flow (@if, @for): Compile-time thay vì runtime directives
- Deferrable views (@defer): Native lazy loading tại template level`,
          tips: [
            'Ivy generate ~40% less code so với View Engine cũ',
            'Zone.js sẽ optional trong tương lai khi Signals mature',
            'Standalone không phải là "simpler NgModule" - nó là architectural shift'
          ]
        },
        {
          title: 'Build System Internals',
          content: `**Angular CLI dùng gì underneath?**

- **esbuild** (Angular 17+): Thay thế webpack cho dev builds, nhanh hơn 10-20x
- **Vite** (experimental): Dev server với native ESM
- **Webpack**: Vẫn dùng cho production builds phức tạp

**Build process flow:**
1. TypeScript compilation (tsc) → JavaScript
2. Ivy compiler: Template → render instructions
3. Bundling: Tree-shaking, code splitting
4. Optimization: Terser minification, differential loading

**angular.json critical configs:**
- \`budgets\`: Enforce bundle size limits, fail build nếu vượt
- \`fileReplacements\`: Swap files theo environment
- \`optimization\`: Enable/disable production optimizations
- \`sourceMap\`: Generate source maps cho debugging`,
          code: {
            language: 'json',
            filename: 'angular.json (build config)',
            code: `// angular.json - Key config
"builder": "@angular-devkit/build-angular:application",
"options": {
  "browser": "src/main.ts",     // Entry point (thay thế 'main')
  "polyfills": ["zone.js"],
  "styles": ["src/styles.scss"]
},
"configurations": {
  "production": { "optimization": true, "sourceMap": false },
  "development": { "optimization": false, "sourceMap": true }
}`
          },
          tips: [
            'ng build --stats-json + webpack-bundle-analyzer để debug bundle size',
            'Budget violations nên là error, không phải warning trong CI',
            'sourceMap: "hidden" cho production nếu cần debug nhưng không expose'
          ]
        },
        {
          title: 'Bootstrap Process',
          content: `**main.ts làm gì?**

\`bootstrapApplication()\` khởi tạo Angular platform và root component:

1. **Create Platform**: PlatformRef chứa Zone.js instance, root injector
2. **Create Application**: ApplicationRef manages component tree
3. **Create Root Injector**: Environment injector với providers từ app.config
4. **Compile & Create Root Component**: Ivy compile template, create view
5. **Attach to DOM**: Insert vào <app-root> selector

**Injector Hierarchy được tạo ra:**
\`\`\`
PlatformInjector (singleton across apps)
    └── EnvironmentInjector (app.config providers)
        └── ElementInjector (component tree)
\`\`\`

**app.config.ts critical providers:**
- \`provideRouter()\`: Setup Router với routes
- \`provideHttpClient()\`: Setup HttpClient với interceptors
- \`provideAnimations()\`: Enable animations module
- \`provideZoneChangeDetection()\`: Configure Zone.js behavior`,
          code: {
            language: 'typescript',
            filename: 'main.ts + app.config.ts',
            code: `// main.ts - Entry point
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

// app.config.ts - Application configuration

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js config - eventCoalescing giảm CD cycles
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router với features
    provideRouter(routes,
      withViewTransitions(),           // Native View Transitions API
      withComponentInputBinding()      // Route params as @Input()
// ...
`
          },
          tips: [
            'provideZoneChangeDetection({ eventCoalescing: true }) giảm CD runs đáng kể',
            'withFetch() tốt hơn XHR cho streaming responses',
            'provideAnimationsAsync() lazy load animation code'
          ]
        },
        {
          title: 'Compilation Pipeline',
          content: `**Ivy Compiler làm gì với template?**

Template không phải HTML - nó là DSL được compile thành JavaScript instructions.

**Compilation stages:**
1. **Parse**: Template string → AST (Abstract Syntax Tree)
2. **Analyze**: Type-check expressions, resolve references
3. **Transform**: AST → Ivy instructions (ɵɵelementStart, ɵɵtext, etc.)
4. **Emit**: Generate JavaScript code

**Tại sao AOT tốt hơn JIT?**
- **AOT (Ahead-of-Time)**: Compile lúc build → smaller bundle, faster startup
- **JIT (Just-in-Time)**: Compile trong browser → cần ship compiler (>100KB)

**Template type-checking:**
Angular check types trong templates. Config trong tsconfig.json:
- \`strictTemplates: true\`: Full type checking
- \`strictInputAccessModifiers: true\`: Respect private/protected`,
          code: {
            language: 'typescript',
            filename: 'compiled-output.js (simplified)',
            code: `// Template:
// <div class="container">
//   <h1>{{ title }}</h1>
//   <button (click)="onClick()">Click</button>
// </div>

// Ivy compiled output (simplified):
function MyComponent_Template(rf, ctx) {
  if (rf & 1) {  // RenderFlags.Create
    ɵɵelementStart(0, "div", 0);  // <div class="container">
    ɵɵelementStart(1, "h1");       // <h1>
    ɵɵtext(2);                     // text node for interpolation
    ɵɵelementEnd();                // </h1>
    ɵɵelementStart(3, "button", 1);
    ɵɵlistener("click", function() { return ctx.onClick(); });
// ...
`
          },
          tips: [
            'Ivy instructions ~40% smaller than View Engine',
            'strictTemplates catch nhiều bugs tại compile time',
            'AOT là default từ Angular 9+'
          ]
        },
        {
          title: 'Binding Internals',
          content: `**Binding được compile thành gì?**

Mỗi loại binding compile thành Ivy instructions khác nhau:
- \`{{ expr }}\` → \`ɵɵtextInterpolate(expr)\`
- \`[prop]="expr"\` → \`ɵɵproperty("prop", expr)\`
- \`(event)="handler()"\` → \`ɵɵlistener("event", fn)\`
- \`[(ngModel)]\` → desugars thành \`[ngModel] + (ngModelChange)\`

**Dirty checking mechanism:**
Mỗi binding có index trong LView array. Change detection so sánh giá trị mới với giá trị cũ tại index đó.

**Performance implications:**
- Function calls trong template (\`{{ getX() }}\`) chạy MỖI CD cycle
- Pure pipes được memoized, impure pipes thì không
- Object/array reference comparison, không deep equal`,
          code: {
            language: 'typescript',
            filename: 'binding-performance.ts',
            code: `// ❌ BAD: Function call in template - runs every CD cycle
template: \`{{ getFullName() }}\`  // Called 5-10 times per interaction!

// ✅ GOOD: Pre-computed value or pure pipe
template: \`{{ fullName }}\`
// hoặc
template: \`{{ user | fullName }}\`  // Pure pipe, memoized

// ❌ BAD: New object reference in template
template: \`<app-child [config]="{ theme: 'dark' }"></app-child>\`
// Tạo object mới mỗi CD → child OnPush vẫn bị trigger

// ✅ GOOD: Stable reference
config = { theme: 'dark' };
template: \`<app-child [config]="config"></app-child>\`
// ...
`
          },
          tips: [
            'Avoid function calls in templates - use computed properties hoặc pipes',
            'trackBy với unique ID, không dùng $index',
            'runOutsideAngular cho heavy computations'
          ]
        },
        {
          title: 'View Queries Deep Dive',
          content: `**ViewChild/ViewChildren vs ContentChild/ContentChildren**

Đây là 2 khái niệm hoàn toàn khác nhau:
- **View**: Template của component hiện tại (những gì trong template)
- **Content**: Projected content từ parent (những gì trong <ng-content>)

**Query timing - static vs dynamic:**
- \`static: true\`: Query resolve TRƯỚC ngOnInit (element phải luôn tồn tại)
- \`static: false\` (default): Query resolve SAU ngAfterViewInit

**Query Resolution Algorithm:**
1. Angular traverse component's view/content
2. Match selector (string, component type, TemplateRef, etc.)
3. Return first match (ViewChild) hoặc QueryList (ViewChildren)`,
          code: {
            language: 'typescript',
            filename: 'view-queries.ts',
            code: `@Component({
  template: \`
    <!-- VIEW - thuộc về component này -->
    <input #staticInput>
    @if (showDynamic) {
      <input #dynamicInput>
    }
    <app-child #childComponent></app-child>

    <!-- CONTENT slot - nhận từ parent -->
    <ng-content select="[header]"></ng-content>
    <ng-content></ng-content>
  \`
})
export class QueryDemo implements OnInit, AfterViewInit, AfterContentInit {
  // ...
`
          },
          tips: [
            'QueryList.changes emit khi DOM thay đổi (add/remove elements)',
            'read option để specify return type: @ViewChild(\'tpl\', { read: TemplateRef })',
            'descendants: false để chỉ query direct children (ContentChildren)'
          ]
        }
      ]
    },

    // === COMPONENTS - SENIOR LEVEL ===
    {
      id: 'components',
      title: 'Component Architecture',
      category: 'components',
      icon: '🧩',
      sections: [
        {
          title: 'Component Internals',
          content: `**Component = View + Logic + Injector**

Khi Angular tạo component, nó tạo:
1. **ComponentRef**: Handle để interact với component
2. **LView**: Data structure chứa binding values
3. **ElementInjector**: DI container cho component này

**View Encapsulation modes:**
- \`Emulated\` (default): Scope CSS bằng attribute selectors (_ngcontent-xxx)
- \`ShadowDom\`: Native Shadow DOM encapsulation
- \`None\`: Global CSS, không scope

**Host binding/listening:**
Component có thể bind/listen trên host element (element của chính nó).`,
          code: {
            language: 'typescript',
            filename: 'component-internals.ts',
            code: `@Component({
  selector: 'app-button',
  standalone: true,
  // Host bindings - bind trên <app-button> element
  host: {
    'class': 'btn',                           // Static class
    '[class.btn-primary]': 'primary',         // Conditional class
    '[class.btn-disabled]': 'disabled',
    '[attr.aria-disabled]': 'disabled',       // Accessibility
    '[attr.tabindex]': 'disabled ? -1 : 0',
    '(click)': 'onClick($event)',             // Host listener
    '(keydown.enter)': 'onClick($event)',
  },
  template: \`<ng-content></ng-content>\`,
  // Encapsulation affects CSS scoping
  // ...
`
          },
          tips: [
            'host object là cleaner hơn @HostBinding/@HostListener decorators',
            'OnPush + Immutable data = massive performance gains',
            'setInput() trigger CD, direct property assignment thì không'
          ]
        },
        {
          title: 'Input/Output Evolution',
          content: `**Decorator-based vs Signal-based**

Angular 17+ giới thiệu signal-based inputs/outputs. Tại sao?
- Decorator inputs: Không reactive, cần OnChanges để detect
- Signal inputs: Reactive by design, auto-track dependencies

**Transform function:**
Input có thể transform giá trị trước khi assign. Useful cho coercion.

**Model inputs:**
Two-way binding mới, cleaner hơn @Input() + @Output() combo.`,
          code: {
            language: 'typescript',
            filename: 'input-output-modern.ts',
            code: `// === DECORATOR-BASED (traditional) ===
@Component({...})
export class TraditionalComponent implements OnChanges {
  @Input() value!: string;
  @Input({ required: true }) id!: number;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Output() valueChange = new EventEmitter<string>();

  // Phải dùng OnChanges để react to input changes
  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) {
      console.log('value changed:', changes['value'].currentValue);
    }
  }
}
// ...
`
          },
          tips: [
            'Signal inputs are the future - migrate gradually',
            'model() replaces @Input() + @Output() pattern',
            'input.required<T>() cho compile-time checking'
          ]
        },
        {
          title: 'Content Projection Deep Dive',
          content: `**ng-content vs ng-template - Fundamental difference**

- \`ng-content\`: Static projection, content rendered at parent level
- \`ng-template\`: Dynamic, content rendered when/where you want

**Key insight:** ng-content projected content là STATIC - nó được render ở parent, chỉ "move" vào child. Không thể control khi nào render.

**ngTemplateOutlet:** Cho phép render template dynamically, pass context.`,
          code: {
            language: 'typescript',
            filename: 'projection-deep.ts',
            code: `// ng-content: ALWAYS rendered (even when hidden) - static projection
// ng-template: Only rendered when needed - truly lazy

// ng-template + ContentChild = lazy rendering
@Component({
  template: \`
    @if (expanded) {
      <ng-container *ngTemplateOutlet="tpl"></ng-container>
    }
  \`
})
export class LazyPanel {
  @ContentChild(TemplateRef) tpl!: TemplateRef<unknown>;
}

// ngTemplateOutlet with context:
// <ng-template let-user let-i="index">{{ user.name }}</ng-template>
// *ngTemplateOutlet="tpl; context: { $implicit: user, index: i }"`
          },
          tips: [
            'ng-content = static projection, ng-template = dynamic rendering',
            'Use ng-template + ContentChild for truly lazy content',
            'ngTemplateOutlet context: $implicit là default, others are named'
          ]
        },
        {
          title: 'ViewChild & ViewChildren',
          content: `ViewChild và ViewChildren decorator cho phép truy cập child elements, components, hoặc directives từ component class.

**ViewChild options:**
- **{ static: true }**: Query trước ngOnInit (element không trong @if/@for)
- **{ static: false }** (default): Query sau ngOnInit
- **{ read: ElementRef }**: Đọc ElementRef thay vì component instance

**ViewChildren** trả về QueryList - một iterable collection có thể observe changes.`,
          code: {
            language: 'typescript',
            filename: 'view-child.component.ts',
            code: `import {
  Component, ViewChild, ViewChildren, QueryList,
  ElementRef, AfterViewInit, ChangeDetectorRef

// Child component
@Component({
  selector: 'app-item',
  template: \`<div>{{ name }}</div>\`
})
export class ItemComponent {
  @Input() name = '';

  highlight() {
    console.log('Highlighting:', this.name);
  }
  // ...
`
          },
          tips: [
            'ViewChild undefined trong constructor và ngOnInit (trừ static: true)',
            'ViewChildren.changes là Observable - subscribe để react khi list thay đổi',
            'Prefer component interaction qua @Input/@Output hơn là ViewChild'
          ]
        },
        {
          title: 'ContentChild & ContentChildren',
          content: `ContentChild và ContentChildren query projected content (nội dung giữa thẻ mở và đóng của component).

**Khác biệt với ViewChild:**
- ViewChild: Query trong template của component
- ContentChild: Query nội dung được project vào component

Hữu ích khi build container components như tabs, accordions, menus.`,
          code: {
            language: 'typescript',
            filename: 'content-child.component.ts',
            code: `import { Component, ContentChild, ContentChildren, QueryList,
         AfterContentInit, TemplateRef, Directive } from '@angular/core';

// Directive để mark tab headers
@Directive({ selector: '[tabHeader]', standalone: true })
export class TabHeaderDirective {}

// Tab component
@Component({
  selector: 'app-tab',
  standalone: true,
  template: \`<ng-content></ng-content>\`
})
export class TabComponent {
  @Input() title = '';
         // ...
`
          },
          tips: [
            'ContentChild/ContentChildren available trong ngAfterContentInit',
            'Dùng { descendants: true } để query nested content',
            'Có thể query TemplateRef để sử dụng với ngTemplateOutlet'
          ]
        },
        {
          title: 'View Encapsulation',
          content: `View Encapsulation quyết định cách styles của component được áp dụng và isolated.

**3 chế độ encapsulation:**
1. **Emulated (default)**: Emulate Shadow DOM bằng unique attributes
2. **None**: Styles trở thành global, ảnh hưởng toàn app
3. **ShadowDom**: Sử dụng native Shadow DOM (browser support cần thiết)

Hiểu rõ encapsulation giúp tránh style conflicts và debug CSS issues.`,
          code: {
            language: 'typescript',
            filename: 'encapsulation.component.ts',
            code: `import { Component, ViewEncapsulation } from '@angular/core';
// EMULATED (Default) - Angular adds unique attributes
@Component({
  selector: 'app-emulated',
  encapsulation: ViewEncapsulation.Emulated,
  template: \`<p class="text">Emulated encapsulation</p>\`,
  styles: [\`
    .text { color: blue; }
    /* Output: .text[_ngcontent-abc123] { color: blue; } */
  \`]
})
export class EmulatedComponent {}

// NONE - Styles become global
@Component({
// ...
`
          },
          tips: [
            '::ng-deep đang deprecated - prefer CSS custom properties hoặc global styles',
            'ViewEncapsulation.None hữu ích cho global theming',
            ':host-context giúp style component dựa trên parent context'
          ]
        },
        {
          title: 'Component Lifecycle Complete',
          content: `Hiểu đầy đủ lifecycle giúp biết khi nào nên thực hiện operations cụ thể.

**Thứ tự lifecycle hooks:**
1. constructor - DI only
2. ngOnChanges - Input changes
3. ngOnInit - Initialize component
4. ngDoCheck - Custom change detection
5. ngAfterContentInit - Content projection ready
6. ngAfterContentChecked - After content check
7. ngAfterViewInit - View children ready
8. ngAfterViewChecked - After view check
9. ngOnDestroy - Cleanup

**OnPush component** chỉ check khi @Input reference thay đổi.`,
          code: {
            language: 'typescript',
            filename: 'lifecycle-complete.component.ts',
            code: `// Th\u1ee9 t\u1ef1 lifecycle hooks:
// constructor  -> DI only, inputs ch\u01b0a c\u00f3
// ngOnChanges  -> @Input thay \u0111\u1ed5i (c\u00f3 SimpleChanges)
// ngOnInit     -> Setup logic, fetch data, subscriptions
// ngDoCheck    -> Custom CD (ch\u1ea1y m\u1ed7i CD cycle - c\u1ea9n th\u1eadn!)
// ngAfterContentInit/Checked -> ContentChild available
// ngAfterViewInit/Checked    -> ViewChild available
// ngOnDestroy  -> Cleanup subscriptions, timers

// Pattern chu\u1ea9n:
private destroy$ = new Subject<void>();
ngOnInit() {
  this.service.data$.pipe(takeUntil(this.destroy$)).subscribe();
}
ngOnDestroy() {
  this.destroy$.next();
  this.destroy$.complete();
}`
          },
          tips: [
            'ngOnInit là nơi tốt nhất cho setup logic - inputs đã available',
            'Luôn cleanup subscriptions trong ngOnDestroy để tránh memory leaks',
            'Tránh modify state trong ngAfterViewChecked - gây infinite loop'
          ]
        }
      ]
    },

    // === SIGNALS ===
    {
      id: 'signals',
      title: 'Signals',
      category: 'signals',
      icon: '⚡',
      sections: [
        {
          title: 'Signal là gì?',
          content: `**Signal** là reactive primitive mới trong Angular 16+, cung cấp cách đơn giản hơn RxJS để quản lý state.

**Ưu điểm của Signals:**
- **Đơn giản**: Không cần subscribe/unsubscribe
- **Type-safe**: Full TypeScript support
- **Fine-grained**: Chỉ update những gì thay đổi
- **Synchronous**: Giá trị luôn available ngay lập tức

**3 loại chính:**
- **signal()**: Writable signal - có thể thay đổi
- **computed()**: Derived signal - tự động tính từ signals khác
- **effect()**: Side effect - chạy khi dependencies thay đổi`,
          code: {
            language: 'typescript',
            filename: 'signals-basic.ts',
            code: `import { signal, computed, effect } from '@angular/core';
// 1. Writable Signal
const count = signal(0);
console.log(count());        // Đọc: 0
count.set(5);                // Ghi: set giá trị mới
count.update(n => n + 1);    // Ghi: update dựa trên giá trị cũ

// 2. Computed Signal - tự động update
const doubled = computed(() => count() * 2);
console.log(doubled());      // 12 (auto-computed)

// 3. Effect - chạy side effects
effect(() => {
  console.log('Count changed:', count());
  // Tự động chạy lại khi count() thay đổi
// ...
`
          },
          tips: [
            'Đọc signal bằng cách gọi như function: count()',
            'computed() tự động track dependencies',
            'Không cần subscribe/unsubscribe như Observable'
          ]
        },
        {
          title: 'Reactive Graph Architecture (Deep Dive)',
          content: `**Signal KHÔNG phải chỉ là "wrapper for value"**

Signal là node trong **reactive graph**. Khi value thay đổi, graph propagate changes to dependents.

**Core concepts:**
- **Producer**: Signal that can notify consumers (WritableSignal, computed)
- **Consumer**: Entity that reacts to changes (computed, effect, template)
- **Reactive Context**: Execution context where dependencies are tracked

**Push-Pull Hybrid Model:**
- **Push**: Producer notify consumers "I changed" (mark dirty)
- **Pull**: Consumer re-compute value only when read (lazy evaluation)

**Glitch-free Guarantee:**
Signals ensure consistent reads - không bao giờ đọc được intermediate inconsistent state.`,
          code: {
            language: 'typescript',
            filename: 'signal-internals.ts',
            code: `// Under the hood (simplified mental model)
interface ReactiveNode {
  value: unknown;
  version: number;           // Increment on change
  dirty: boolean;            // Needs recomputation
  producerNodes: Set<ReactiveNode>;  // Dependencies
  consumerNodes: Set<ReactiveNode>;  // Dependents
}

// When signal.set() is called:
// 1. Update value
// 2. Increment version
// 3. Mark all consumers as DIRTY (push phase)
// 4. DON'T recompute consumers yet (lazy)

// ...
`
          },
          tips: [
            'Signals use topological sort for consistent evaluation order',
            'Reading signal in effect/computed auto-tracks dependency',
            'untracked() to read without tracking'
          ]
        },
        {
          title: 'Effect Scheduling & Cleanup',
          content: `**Effect KHÔNG chạy ngay lập tức**

Effects được schedule để chạy trong microtask, SAU khi current execution context hoàn tất.

**Effect lifecycle:**
1. Created → Scheduled for first run
2. Run → Dependencies tracked
3. Signal changes → Effect marked dirty, re-scheduled
4. Component destroyed → Effect auto-cleaned up

**Cleanup function:**
Effect có thể return cleanup function, chạy TRƯỚC mỗi re-run.`,
          code: {
            language: 'typescript',
            filename: 'effect-deep.ts',
            code: `// Effect batching - ch\u1ea1y 1 l\u1ea7n v\u1edbi gi\u00e1 tr\u1ecb cu\u1ed1i
count.set(1); count.set(2); count.set(3);
// effect ch\u1ec9 ch\u1ea1y 1 l\u1ea7n v\u1edbi count = 3

// Cleanup function - ch\u1ea1y TR\u01af\u1edaC m\u1ed7i re-run
effect((onCleanup) => {
  const sub = obs$.subscribe();
  onCleanup(() => sub.unsubscribe());
});

// untracked - \u0111\u1ecdc m\u00e0 kh\u00f4ng track dependency
effect(() => {
  console.log(this.count());                    // tracked
  console.log(untracked(() => this.name()));    // NOT tracked
});`
          },
          tips: [
            'Effects are batched - multiple signal changes = one effect run',
            'Use onCleanup for subscriptions, timers, etc.',
            'allowSignalWrites can cause infinite loops - use sparingly'
          ]
        },
        {
          title: 'Signal vs Observable Trade-offs',
          content: `**Fundamentally different models:**

| Aspect | Signal | Observable |
|--------|--------|------------|
| Evaluation | Pull (lazy) | Push (eager) |
| Current value | Always has one | May not have |
| Async | Sync only | Async native |
| Operators | Limited | Rich (200+) |
| Memory | One value | Stream history |
| Cancellation | N/A | Unsubscribe |

**When to use which:**
- **Signal**: UI state, derived values, simple reactivity
- **Observable**: HTTP, events over time, complex async flows`,
          code: {
            language: 'typescript',
            filename: 'signal-vs-observable.ts',
            code: `// Signal: UI state, derived values (sync)
query = signal('');
results = computed(() => this.data().filter(/* ... */));

// Observable: async flows (debounce, switchMap)
results$ = this.query$.pipe(
  debounceTime(300),
  switchMap(q => this.api.search(q))
);

// Interop:
results = toSignal(this.results$, { initialValue: [] });  // Obs -> Signal
query$ = toObservable(this.querySignal);                    // Signal -> Obs`
          },
          tips: [
            'toSignal với HTTP cần initialValue hoặc handle undefined',
            'Observables vẫn cần cho complex async (debounce, switchMap)',
            'Signals are synchronous - không thể "wait" for value'
          ]
        },
        {
          title: 'Signal Inputs (Angular 17.1+)',
          content: `Signal-based inputs là cách mới để nhận data từ parent, thay thế @Input() decorator.

**Ưu điểm:**
- Type-safe hơn @Input()
- Tự động là readonly signal
- Dễ dàng derive computed values
- Required inputs rõ ràng hơn

**Các loại input():**
- **input()**: Optional input với default value
- **input.required()**: Required input
- **input() với transform**: Transform value khi nhận`,
          code: {
            language: 'typescript',
            filename: 'signal-inputs.ts',
            code: `import { Component, input, computed } from '@angular/core';
@Component({
  selector: 'app-user-card',
  template: \`
    <div class="card" [class.featured]="featured()">
      <h2>{{ displayName() }}</h2>
      <p>Age: {{ age() }}</p>
      @if (showEmail()) {
        <p>Email: {{ user().email }}</p>
      }
    </div>
  \`
})
export class UserCardComponent {
  // Required input - parent PHẢI truyền
// ...
`
          },
          tips: [
            'Signal inputs là readonly - không thể set() từ component',
            'Dùng input.required() khi value bắt buộc phải có',
            'transform chạy mỗi khi input thay đổi'
          ]
        },
        {
          title: 'Signal Outputs (Angular 17.3+)',
          content: `output() là cách mới để emit events lên parent, thay thế @Output() với EventEmitter.

**Ưu điểm:**
- Không cần import EventEmitter
- Type-safe hơn
- Syntax đơn giản hơn
- Có thể dùng outputFromObservable()`,
          code: {
            language: 'typescript',
            filename: 'signal-outputs.ts',
            code: `import { Component, output, outputFromObservable } from '@angular/core';
@Component({
  selector: 'app-counter',
  template: \`
    <button (click)="decrement()">-</button>
    <span>{{ count }}</span>
    <button (click)="increment()">+</button>
    <button (click)="reset()">Reset</button>
  \`
})
export class CounterComponent {
  count = 0;

  // Basic output
  countChange = output<number>();
// ...
`
          },
          tips: [
            'output() không cần generic nếu emit không có value',
            'outputFromObservable auto-cleanup khi component destroy',
            'Vẫn có thể dùng @Output() - output() là optional'
          ]
        },
        {
          title: 'Model Inputs (Angular 17.2+)',
          content: `model() tạo two-way binding signal - kết hợp input và output trong một.

**Use cases:**
- Form controls
- Toggles, switches
- Bất kỳ state cần sync giữa parent và child

model() tự động tạo cả input và output với naming convention: [value] và (valueChange).`,
          code: {
            language: 'typescript',
            filename: 'model-inputs.ts',
            code: `import { Component, model, computed } from '@angular/core';
// Custom toggle component với two-way binding
@Component({
  selector: 'app-toggle',
  template: \`
    <button
      [class.active]="checked()"
      (click)="toggle()"
    >
      {{ checked() ? 'ON' : 'OFF' }}
    </button>
  \`
})
export class ToggleComponent {
  // model() = input() + output() combined
// ...
`
          },
          tips: [
            'model() tự động tạo [prop] và (propChange) pair',
            'model là WritableSignal - có thể set() và update()',
            'Dùng model() để tạo reusable form controls'
          ]
        },
        {
          title: 'Advanced Signal Patterns',
          content: `Các patterns nâng cao khi làm việc với Signals trong Angular.

**Patterns phổ biến:**
- State management với signals
- Derived state với computed chains
- Side effects với effect()
- Resource loading pattern`,
          code: {
            language: 'typescript',
            filename: 'advanced-signals.ts',
            code: `import { Component, signal, computed, effect, inject, untracked } from '@angular/core';
// Pattern 1: State management service
@Injectable({ providedIn: 'root' })
export class TodoStore {
  // Private writable signals
  private _todos = signal<Todo[]>([]);
  private _filter = signal<'all' | 'active' | 'completed'>('all');
  private _loading = signal(false);

  // Public readonly signals
  readonly todos = this._todos.asReadonly();
  readonly filter = this._filter.asReadonly();
  readonly loading = this._loading.asReadonly();

  // Derived state
// ...
`
          },
          tips: [
            'asReadonly() để expose signal mà không cho phép modify',
            'untracked() hữu ích khi cần đọc signal mà không trigger effect',
            'Effect cleanup chạy trước khi effect re-runs'
          ]
        }
      ]
    },

    // === CONTROL FLOW ===
    {
      id: 'control-flow',
      title: 'Control Flow (Angular 17+)',
      category: 'directives',
      icon: '🔀',
      sections: [
        {
          title: 'Built-in Control Flow',
          content: `Angular 17 giới thiệu built-in control flow syntax mới, thay thế *ngIf, *ngFor, *ngSwitch với cú pháp đẹp và performance tốt hơn.`,
          code: {
            language: 'html',
            filename: 'control-flow.html',
            code: `<!-- @if - thay thế *ngIf -->
@if (user) {
  <p>Welcome, {{ user.name }}!</p>
} @else if (isLoading) {
  <p>Loading...</p>
} @else {
  <p>Please login</p>
}

<!-- @for - thay thế *ngFor -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found</p>
}
// ...
`
          },
          tips: [
            '@for BẮT BUỘC phải có track - giúp Angular identify items',
            '@empty block hiển thị khi array rỗng',
            'Cú pháp mới có performance tốt hơn vì được compile tốt hơn'
          ]
        },
        {
          title: '@defer - Lazy Loading',
          content: `@defer cho phép lazy load một phần template, giúp cải thiện initial load time.`,
          code: {
            language: 'html',
            filename: 'defer-example.html',
            code: `<!-- Basic defer - load khi idle -->
@defer {
  <app-heavy-component />
}

<!-- Defer với loading và error states -->
@defer (on viewport) {
  <app-comments />
} @loading (minimum 500ms) {
  <div class="skeleton">Loading comments...</div>
} @error {
  <p>Failed to load comments</p>
} @placeholder {
  <p>Comments will appear here</p>
}
// ...
`
          }
        }
      ]
    },

    // === DIRECTIVES ===
    {
      id: 'directives',
      title: 'Directives',
      category: 'directives',
      icon: '🎯',
      sections: [
        {
          title: 'Các loại Directive',
          content: `Angular có 3 loại directive:

**1. Component Directive** - Directive có template (chính là component)
**2. Structural Directive** - Thay đổi cấu trúc DOM (thêm/xóa elements)
**3. Attribute Directive** - Thay đổi appearance/behavior của element`,
          code: {
            language: 'typescript',
            filename: 'directive-types.ts',
            code: `// Component Directive
@Component({
  selector: 'app-hello',
  template: '<h1>Hello</h1>'
})
export class HelloComponent {}

// Structural Directive (tự tạo)
@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      this.vcRef.createEmbeddedView(this.templateRef);
// ...
`
          }
        },
        {
          title: 'Built-in Attribute Directives',
          content: `Angular cung cấp nhiều built-in attribute directives hữu ích.`,
          code: {
            language: 'html',
            filename: 'built-in-directives.html',
            code: `<!-- ngClass - add/remove CSS classes -->
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">
<div [ngClass]="['class1', 'class2']">

<!-- ngStyle - add inline styles -->
<div [ngStyle]="{ 'color': textColor, 'font-size': fontSize + 'px' }">

<!-- ngModel - two-way binding (cần FormsModule) -->
<input [(ngModel)]="username">

<!-- Cú pháp mới với class binding -->
<div [class.active]="isActive">
<div [style.color]="textColor">
<div [style.font-size.px]="fontSize">`
          }
        }
      ]
    },

    // === SERVICES & DI ===
    {
      id: 'services',
      title: 'Services & Dependency Injection',
      category: 'services',
      icon: '🔧',
      sections: [
        {
          title: 'Service và DI là gì?',
          content: `**Service** là class chứa business logic, data, hoặc shared functionality giữa các components.

**Dependency Injection (DI)** là design pattern mà Angular dùng để cung cấp dependencies cho components/services.

**Tại sao dùng DI?**
- **Loose coupling**: Components không cần biết cách tạo dependencies
- **Testability**: Dễ mock dependencies trong unit tests
- **Reusability**: Services có thể shared giữa nhiều components`,
          code: {
            language: 'typescript',
            filename: 'services-basic.ts',
            code: `// 1. Tạo Service
@Injectable({
  providedIn: 'root'  // Singleton cho toàn app
})
export class UserService {
  private users = signal<User[]>([]);

  readonly users$ = this.users.asReadonly();

  constructor(private http: HttpClient) {}

  loadUsers() {
    this.http.get<User[]>('/api/users').subscribe(data => {
      this.users.set(data);
    });
// ...
`
          },
          tips: [
            'providedIn: "root" tạo singleton service, tree-shakable',
            'inject() chỉ dùng trong injection context',
            'Service ở component providers = mỗi component có instance riêng'
          ]
        },
        {
          title: 'Injector Hierarchy (Deep Dive)',
          content: `**DI System = Tree of Injectors**

Angular có 2 parallel injector trees:
1. **Environment Injector** (Module/App level)
2. **Element Injector** (Component level)

**Resolution order:**
1. Element Injector (component → parent → ... → root element)
2. Environment Injector (feature → root → platform)

**NULL Injector:**
End of chain - throws error nếu không tìm thấy (trừ khi optional).`,
          code: {
            language: 'typescript',
            filename: 'injector-hierarchy.ts',
            code: `// Injector tree visualization:
//
// NullInjector (throws if reached)
//        ↑
// PlatformInjector (Angular platform services)
//        ↑
// EnvironmentInjector (app.config providers, lazy modules)
//        ↑
// ElementInjector (component tree)
//   AppComponent
//      ├── HeaderComponent
//      └── ContentComponent
//           └── UserCardComponent ← inject() called here

// Resolution algorithm (pseudo-code):
// ...
`
          },
          tips: [
            'Element injector checked BEFORE environment injector',
            'providedIn: "root" = singleton in environment injector',
            'Component providers = new instance per component'
          ]
        },
        {
          title: 'Provider Types & Tokens',
          content: `**Provider = Recipe to create dependency**

Angular hỗ trợ nhiều loại providers:
- **useClass**: Instantiate a class
- **useValue**: Use existing value
- **useFactory**: Call factory function
- **useExisting**: Alias to another token

**InjectionToken:** Type-safe token cho non-class values.`,
          code: {
            language: 'typescript',
            filename: 'providers.ts',
            code: `import { InjectionToken, inject, Provider } from '@angular/core';
// === INJECTION TOKEN ===
// For values that aren't classes (primitives, interfaces, functions)
export const API_URL = new InjectionToken<string>('API_URL');
export const CONFIG = new InjectionToken<AppConfig>('CONFIG', {
  providedIn: 'root',
  factory: () => ({ apiUrl: '/api', debug: false })
});

// === PROVIDER TYPES ===
const providers: Provider[] = [
  // 1. useClass - instantiate class
  { provide: Logger, useClass: Logger },          // Same as just Logger
  { provide: Logger, useClass: FileLogger },      // Substitute implementation
  { provide: Logger, useClass: Logger, multi: true }, // Multi-provider
// ...
`
          },
          tips: [
            'useFactory deps order must match function parameters',
            'multi: true collects all providers into array',
            'providedIn: "root" enables tree-shaking'
          ]
        },
        {
          title: 'forRoot/forChild Pattern',
          content: `**Problem:** Module imported multiple times → multiple service instances.

**forRoot/forChild pattern:**
- \`forRoot()\`: Provides services (import once in AppModule)
- \`forChild()\`: No services (import in feature modules)

**Modern alternative:** \`providedIn: 'root'\` handles this automatically.`,
          code: {
            language: 'typescript',
            filename: 'for-root.ts',
            code: `// Classic NgModule pattern (still used in some libraries)
@NgModule({
  declarations: [ToastComponent],
  exports: [ToastComponent],
})
export class ToastModule {
  // forRoot = provides singleton service
  static forRoot(config?: ToastConfig): ModuleWithProviders<ToastModule> {
    return {
      ngModule: ToastModule,
      providers: [
        ToastService,
        { provide: TOAST_CONFIG, useValue: config ?? defaultConfig }
      ]
    };
// ...
`
          },
          tips: [
            'providedIn: "root" makes forRoot/forChild unnecessary',
            'Lazy routes get child environment injector automatically',
            'Route providers are scoped to that route subtree'
          ]
        }
      ]
    },

    // === LIFECYCLE ===
    {
      id: 'lifecycle',
      title: 'Lifecycle Hooks',
      category: 'lifecycle',
      icon: '🔄',
      sections: [
        {
          title: 'Lifecycle Hooks Overview',
          content: `Angular components có các lifecycle hooks được gọi theo thứ tự cụ thể. Hiểu rõ lifecycle giúp bạn biết khi nào nên thực hiện các operations.`,
          code: {
            language: 'typescript',
            filename: 'lifecycle.component.ts',
            code: `import {
  Component, OnInit, OnDestroy, OnChanges,
  AfterViewInit, Input, SimpleChanges

@Component({ ... })
export class LifecycleComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() data!: string;

  // 1. Constructor - DI, không access DOM
  constructor() {
    console.log('1. Constructor');
  }

  // 2. ngOnChanges - Khi @Input thay đổi
  ngOnChanges(changes: SimpleChanges) {
  // ...
`
          }
        },
        {
          title: 'Thứ tự Lifecycle Hooks',
          content: `Thứ tự đầy đủ các lifecycle hooks:

1. **constructor** - Inject dependencies
2. **ngOnChanges** - Input properties thay đổi
3. **ngOnInit** - Khởi tạo component (1 lần)
4. **ngDoCheck** - Custom change detection
5. **ngAfterContentInit** - Sau khi content projection
6. **ngAfterContentChecked** - Sau mỗi check content
7. **ngAfterViewInit** - Sau khi view render
8. **ngAfterViewChecked** - Sau mỗi check view
9. **ngOnDestroy** - Cleanup`,
          tips: [
            'ngOnInit là nơi tốt nhất để fetch data ban đầu',
            'ngOnDestroy PHẢI unsubscribe các subscriptions để tránh memory leak',
            'Không access ViewChild trong ngOnInit - dùng ngAfterViewInit',
            'ngOnChanges chỉ được gọi khi @Input reference thay đổi'
          ]
        }
      ]
    },

    // === RxJS ===
    {
      id: 'rxjs',
      title: 'RxJS',
      category: 'rxjs',
      icon: '🌊',
      sections: [
        {
          title: 'RxJS là gì?',
          content: `**RxJS (Reactive Extensions for JavaScript)** là library để làm việc với asynchronous data streams.

**Core Concepts:**
- **Observable**: Stream of values theo thời gian
- **Observer**: Consumer nhận values từ Observable
- **Subscription**: Connection giữa Observable và Observer
- **Operators**: Functions để transform streams

**Observable vs Promise:**
| Observable | Promise |
|------------|---------|
| Nhiều values | 1 value |
| Lazy (chỉ chạy khi subscribe) | Eager (chạy ngay) |
| Cancellable | Không cancel được |
| Có operators | Chỉ .then/.catch |`,
          code: {
            language: 'typescript',
            filename: 'rxjs-basic.ts',
            code: `import { Observable, of, from, interval } from 'rxjs';
// Tạo Observable
const numbers$ = of(1, 2, 3, 4, 5);
const array$ = from([1, 2, 3]);
const timer$ = interval(1000);  // Emit mỗi giây

// Subscribe
const subscription = numbers$.subscribe({
  next: (value) => console.log(value),
  error: (err) => console.error(err),
  complete: () => console.log('Done!')
});

// QUAN TRỌNG: Unsubscribe!
subscription.unsubscribe();
// ...
`
          },
          tips: [
            'LUÔN unsubscribe để tránh memory leaks',
            'async pipe tự động unsubscribe',
            'switchMap cancel request cũ - tốt cho search'
          ]
        },
        {
          title: 'Observable Contract (Deep Dive)',
          content: `**Observable KHÔNG phải là event emitter**

Observable là **lazy push collection**:
- **Lazy**: Không làm gì cho đến khi subscribe
- **Push**: Producer pushes values to consumer
- **Contract**: next*(error|complete)?

**Key insight:** Observable là function. Subscribe = gọi function đó.`,
          code: {
            language: 'typescript',
            filename: 'observable-internals.ts',
            code: `// Observable is just a function
class Observable<T> {
  constructor(private _subscribe: (subscriber: Subscriber<T>) => TeardownLogic) {}

  subscribe(observer: Observer<T>): Subscription {
    const subscriber = new Subscriber(observer);
    // This is where the "work" happens
    const teardown = this._subscribe(subscriber);
    return new Subscription(teardown);
  }
}

// Creating observable = defining what happens on subscribe
const myObservable$ = new Observable(subscriber => {
  // This code runs WHEN subscribed, not when created
// ...
`
          },
          tips: [
            'Cold = unicast (each subscriber = new execution)',
            'Hot = multicast (shared execution)',
            'Subject = both Observable and Observer'
          ]
        },
        {
          title: 'Higher-Order Mapping',
          content: `**switchMap/mergeMap/concatMap/exhaustMap - The core difference**

All of them: outer$ → inner$ (map to observable, then flatten)

**Difference is HOW they handle concurrent inner observables:**
- \`switchMap\`: Cancel previous, use latest
- \`mergeMap\`: Run all in parallel
- \`concatMap\`: Queue, run sequentially
- \`exhaustMap\`: Ignore new while current running`,
          code: {
            language: 'typescript',
            filename: 'higher-order.ts',
            code: `// Scenario: User clicks button, each click triggers HTTP request
// === switchMap ===
// Cancel previous request when new click
// USE: Search autocomplete, route params
clicks$.pipe(
  switchMap(() => http.get('/api/data'))
).subscribe();
// Click1 → Request1 starts
// Click2 → Request1 CANCELLED, Request2 starts
// Result: Only Request2 result received

// === mergeMap ===
// All requests run in parallel
// USE: Bulk operations, independent requests
clicks$.pipe(
// ...
`
          },
          tips: [
            'switchMap for search/navigation (cancel stale)',
            'exhaustMap for form submit (prevent double)',
            'concatMap for ordered operations',
            'mergeMap for parallel independent work'
          ]
        },
        {
          title: 'Error Handling & Retry',
          content: `**Error = stream termination (by default)**

Khi error xảy ra, stream dies. Các subscribers không nhận thêm values.

**catchError:** Intercept error, return recovery observable.
**retry/retryWhen:** Resubscribe on error (useful cho network).`,
          code: {
            language: 'typescript',
            filename: 'error-handling.ts',
            code: `import { catchError, retry, retryWhen, delay, take, throwError, EMPTY, of } from 'rxjs';
// === catchError ===
// Intercept error, decide what to do
http.get('/api/data').pipe(
  catchError(error => {
    if (error.status === 404) {
      return of(null);  // Return default value
    }
    if (error.status === 401) {
      this.router.navigate(['/login']);
      return EMPTY;  // Complete without value
    }
    return throwError(() => error);  // Re-throw
  })
);
// ...
`
          },
          tips: [
            'catchError in inner observable keeps outer alive',
            'retry is for transient errors (network)',
            'EMPTY completes without error, useful for "skip"'
          ]
        },
        {
          title: 'Async Pipe & Subscription Management',
          content: `**Memory leaks = subscriptions not cleaned up**

Best practices:
1. **async pipe**: Auto-unsubscribe in template
2. **takeUntilDestroyed()**: Auto-unsubscribe in class (Angular 16+)
3. **Subjects**: Collect subscriptions manually`,
          code: {
            language: 'typescript',
            filename: 'async-pipe.ts',
            code: `@Component({
  template: \`
    <!-- Async pipe tự động subscribe/unsubscribe -->
    @if (users$ | async; as users) {
      @for (user of users; track user.id) {
        <div>{{ user.name }}</div>
      }
    } @else {
      <p>Loading...</p>
    }

    <!-- Combine với other pipes -->
    <p>{{ (user$ | async)?.name | uppercase }}</p>
  \`
})
  // ...
`
          }
        },
        {
          title: 'Higher-Order Mapping Operators',
          content: `Hiểu sự khác biệt giữa switchMap, mergeMap, concatMap, và exhaustMap là quan trọng nhất khi làm việc với RxJS.

**switchMap**: Cancel previous, chỉ giữ latest
**mergeMap**: Chạy parallel, không cancel
**concatMap**: Chạy tuần tự, chờ complete
**exhaustMap**: Ignore new requests khi đang xử lý`,
          code: {
            language: 'typescript',
            filename: 'mapping-operators.ts',
            code: `import { switchMap, mergeMap, concatMap, exhaustMap } from 'rxjs/operators';
// === switchMap ===
// Use case: Search autocomplete - cancel previous search khi user gõ tiếp
searchInput$.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.searchService.search(term))
  // Nếu user gõ "ang" rồi "angular"
  // Request cho "ang" sẽ bị CANCEL, chỉ "angular" được xử lý
);

// === mergeMap ===
// Use case: Multiple file uploads - chạy parallel
uploadButtons$.pipe(
  mergeMap(file => this.uploadService.upload(file), 3) // Max 3 concurrent
// ...
`
          },
          tips: [
            'switchMap là mặc định tốt nhất cho HTTP requests',
            'mergeMap có thể gây race conditions - cẩn thận với order',
            'exhaustMap tốt cho prevent double-submit'
          ]
        },
        {
          title: 'Combination Operators',
          content: `Operators để combine nhiều Observables thành một.

**combineLatest**: Emit khi BẤT KỲ source emit (cần tất cả emit ít nhất 1 lần)
**forkJoin**: Emit một lần khi TẤT CẢ complete
**merge**: Combine thành single stream
**zip**: Pair values theo thứ tự
**withLatestFrom**: Lấy latest value từ other streams`,
          code: {
            language: 'typescript',
            filename: 'combination-operators.ts',
            code: `import {
  combineLatest, forkJoin, merge, zip, race,
  concat, startWith, withLatestFrom

// === combineLatest ===
// Use case: Derived state từ nhiều sources
const vm$ = combineLatest([
  this.users$,
  this.filter$,
  this.sortOrder$
]).pipe(
  map(([users, filter, sort]) => ({
    users: this.applyFilter(users, filter),
    filter,
    sort
  // ...
`
          },
          tips: [
            'combineLatest chờ TẤT CẢ emit ít nhất 1 lần trước khi emit đầu tiên',
            'forkJoin chỉ dùng cho finite Observables (như HTTP)',
            'withLatestFrom không trigger khi secondary stream emit'
          ]
        },
        {
          title: 'Error Handling & Retry',
          content: `Xử lý errors đúng cách là quan trọng cho app stability.

**catchError**: Catch và handle errors
**retry/retryWhen**: Tự động retry khi fail
**finalize**: Cleanup dù success hay error`,
          code: {
            language: 'typescript',
            filename: 'error-handling.ts',
            code: `import {
  catchError, retry, retryWhen, finalize,
  throwError, EMPTY, of

// === Basic catchError ===
this.http.get('/api/users').pipe(
  catchError(error => {
    console.error('Error:', error);
    // Option 1: Return default value
    return of([]);
    // Option 2: Re-throw với custom error
    // return throwError(() => new Error('Custom error'));
    // Option 3: Complete silently
    // return EMPTY;
  })
  // ...
`
          },
          tips: [
            'Không bao giờ để Observable error mà không handle',
            'Retry với exponential backoff để tránh overwhelm server',
            'finalize() giống try-finally - luôn chạy'
          ]
        },
        {
          title: 'Subject Types',
          content: `Subjects vừa là Observable vừa là Observer - có thể push values manually.

**Subject**: Basic subject, không có initial value
**BehaviorSubject**: Có initial value, emit latest cho new subscribers
**ReplaySubject**: Replay n giá trị cuối cho new subscribers
**AsyncSubject**: Chỉ emit giá trị cuối cùng khi complete`,
          code: {
            language: 'typescript',
            filename: 'subjects.ts',
            code: `import { Subject, BehaviorSubject, ReplaySubject, AsyncSubject } from 'rxjs';
// === Subject ===
// New subscribers không nhận values trước đó
const subject = new Subject<number>();

subject.subscribe(x => console.log('A:', x));
subject.next(1); // A: 1
subject.next(2); // A: 2

subject.subscribe(x => console.log('B:', x));
subject.next(3); // A: 3, B: 3

// === BehaviorSubject ===
// PHẢI có initial value, new subscribers nhận latest value ngay
const behavior$ = new BehaviorSubject<string>('initial');
// ...
`
          },
          tips: [
            'BehaviorSubject là phổ biến nhất cho state management',
            'Luôn expose asObservable() để ngăn external next()',
            'Subject complete sẽ không emit gì nữa - cẩn thận!'
          ]
        },
        {
          title: 'RxJS Best Practices',
          content: `Các patterns và best practices khi sử dụng RxJS trong Angular.`,
          code: {
            language: 'typescript',
            filename: 'rxjs-best-practices.ts',
            code: `import { takeUntil, takeUntilDestroyed, shareReplay } from 'rxjs';
// === Pattern 1: takeUntilDestroyed (Angular 16+) ===
// BEST: Automatic cleanup
@Component({ ... })
export class ModernComponent {
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(data => this.data = data);
  }
}

// === Pattern 2: takeUntil với Subject ===
// ...
`
          },
          tips: [
            'takeUntilDestroyed() là cách tốt nhất trong Angular 16+',
            'async pipe trong template là best practice - tự cleanup',
            'Prefer declarative streams over imperative subscribes'
          ]
        }
      ]
    },

    // === FORMS ===
    {
      id: 'forms',
      title: 'Forms',
      category: 'forms',
      icon: '📝',
      sections: [
        {
          title: 'Template-driven vs Reactive Forms',
          content: `Angular có 2 approaches để xử lý forms:

**Template-driven Forms:**
- Dùng directives trong template (ngModel)
- Đơn giản, ít code
- Khó test, logic phân tán

**Reactive Forms:**
- Define form trong component class
- Powerful, flexible
- Dễ test, logic tập trung`,
          code: {
            language: 'typescript',
            filename: 'forms-comparison.ts',
            code: `// TEMPLATE-DRIVEN (cần FormsModule)
@Component({
  imports: [FormsModule],
  template: \`
    <form #f="ngForm" (ngSubmit)="onSubmit(f)">
      <input name="email" [(ngModel)]="email" required email>
      <button [disabled]="f.invalid">Submit</button>
    </form>
  \`
})
export class TemplateFormComponent {
  email = '';
  onSubmit(form: NgForm) { console.log(form.value); }
}

// ...
`
          }
        },
        {
          title: 'Reactive Forms Deep Dive',
          content: `Reactive Forms sử dụng FormControl, FormGroup, và FormArray để build complex forms.`,
          code: {
            language: 'typescript',
            filename: 'reactive-forms.ts',
            code: `import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
@Component({ ... })
export class UserFormComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    address: this.fb.group({
      street: [''],
      city: [''],
      zip: ['']
    }),
    phones: this.fb.array([]) // Dynamic array
  });
// ...
`
          },
          tips: [
            'Dùng FormBuilder để code ngắn gọn hơn',
            'FormArray dùng cho dynamic form fields',
            'Có thể tạo custom validators cho business logic phức tạp'
          ]
        },
        {
          title: 'Custom Validators',
          content: `Tạo custom validators cho business logic riêng. Có 2 loại: Sync và Async validators.`,
          code: {
            language: 'typescript',
            filename: 'custom-validators.ts',
            code: `import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
// ========== SYNC VALIDATORS ==========

// Validator function
export function forbiddenNameValidator(forbidden: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isForbidden = control.value === forbidden;
    return isForbidden ? { forbiddenName: { value: control.value } } : null;
  };
}

// Password strength validator
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
// ...
`
          }
        },
        {
          title: 'Async Validators',
          content: `Async validators dùng cho validation cần gọi API (check email tồn tại, validate username...).`,
          code: {
            language: 'typescript',
            filename: 'async-validators.ts',
            code: `import { AsyncValidatorFn } from '@angular/forms';
// Async validator - check username exists
export function uniqueUsernameValidator(userService: UserService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);

    return timer(500).pipe( // Debounce 500ms
      switchMap(() => userService.checkUsernameExists(control.value)),
      map(exists => exists ? { usernameTaken: true } : null),
      catchError(() => of(null))
    );
  };
}

// Async validator với inject()
// ...
`
          },
          tips: [
            'Async validators chạy SAU sync validators pass',
            'Luôn debounce để tránh gọi API quá nhiều',
            'control.status === "PENDING" khi async validator đang chạy'
          ]
        },
        {
          title: 'Form Error Display',
          content: `Hiển thị validation errors một cách user-friendly.`,
          code: {
            language: 'typescript',
            filename: 'form-errors.ts',
            code: `@Component({
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <div class="field">
        <label>Email</label>
        <input formControlName="email" [class.invalid]="isFieldInvalid('email')">

        <!-- Hiển thị errors -->
        @if (isFieldInvalid('email')) {
          <div class="errors">
            @if (form.get('email')?.hasError('required')) {
              <span>Email là bắt buộc</span>
            }
            @if (form.get('email')?.hasError('email')) {
              <span>Email không hợp lệ</span>
  // ...
`
          }
        },
        {
          title: 'Typed Forms (Angular 14+)',
          content: `Angular 14+ có Strongly Typed Forms, giúp catch errors tại compile time.`,
          code: {
            language: 'typescript',
            filename: 'typed-forms.ts',
            code: `import { FormControl, FormGroup, FormArray } from '@angular/forms';
// Define interface
interface UserForm {
  name: FormControl<string>;
  email: FormControl<string>;
  age: FormControl<number | null>;
  addresses: FormArray<FormGroup<AddressForm>>;
}

interface AddressForm {
  street: FormControl<string>;
  city: FormControl<string>;
}

// Typed FormGroup
// ...
`
          },
          tips: [
            'NonNullableFormBuilder tạo controls với nonNullable: true',
            'getRawValue() trả về tất cả values kể cả disabled controls',
            'Typed forms catch nhiều bugs tại compile time'
          ]
        }
      ]
    },

    // === ROUTING ===
    {
      id: 'routing',
      title: 'Routing',
      category: 'routing',
      icon: '🛤️',
      sections: [
        {
          title: 'Basic Routing',
          content: `Angular Router cho phép navigate giữa các views/components dựa trên URL.`,
          code: {
            language: 'typescript',
            filename: 'app.routes.ts',
            code: `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'users', component: UserListComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: '**', component: NotFoundComponent } // Wildcard
];

// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};`
          }
        },
        {
          title: 'Navigation & Route Params',
          content: `Có nhiều cách để navigate và lấy route parameters.`,
          code: {
            language: 'typescript',
            filename: 'navigation.ts',
            code: `// Template navigation
// <a routerLink="/users">Users</a>
// <a [routerLink]="['/users', user.id]">{{ user.name }}</a>

// Programmatic navigation
@Component({ ... })
export class MyComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  goToUser(id: number) {
    this.router.navigate(['/users', id]);
    // hoặc
    this.router.navigateByUrl(\`/users/\${id}\`);
  }
// ...
`
          }
        },
        {
          title: 'Lazy Loading Routes',
          content: `Lazy loading giúp giảm initial bundle size bằng cách load components/modules khi cần.`,
          code: {
            language: 'typescript',
            filename: 'lazy-routes.ts',
            code: `export const routes: Routes = [
  // Lazy load single component
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent)
  },

  // Lazy load child routes
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];
  // ...
`
          },
          tips: [
            'Lazy loading tự động code-split thành separate chunk',
            'Preloading strategies có thể load lazy modules in background',
            'Route guards có thể protect lazy loaded routes'
          ]
        },
        {
          title: 'Route Guards',
          content: `Guards protect routes và control navigation. Từ Angular 15+, guards có thể là functions.`,
          code: {
            language: 'typescript',
            filename: 'guards.ts',
            code: `import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
// Functional guard (Angular 15+)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/login');
};

// Unsaved changes guard
export const unsavedChangesGuard: CanDeactivateFn<FormComponent> =
// ...
`
          }
        }
      ]
    },

    // === HTTP CLIENT ===
    {
      id: 'http-client',
      title: 'HTTP Client',
      category: 'http',
      icon: '🌐',
      sections: [
        {
          title: 'Cấu hình HttpClient',
          content: `HttpClient là service để gọi HTTP requests. Từ Angular 15+, dùng provideHttpClient() thay vì HttpClientModule.

**Các features của HttpClient:**
- Typed request/response bodies
- Request/response interception
- Observable-based API
- JSON parsing tự động
- Error handling
- Progress events`,
          code: {
            language: 'typescript',
            filename: 'app.config.ts',
            code: `// Angular 17+ - Standalone
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, loggingInterceptor]),
      withFetch() // Dùng Fetch API thay vì XMLHttpRequest
    )
  ]
};

// Legacy - NgModule based
@NgModule({
  imports: [
    HttpClientModule
  ]
})
export class AppModule {}`
          },
          tips: [
            'provideHttpClient() là cách mới, tree-shakable',
            'withFetch() dùng Fetch API, hỗ trợ streaming',
            'Có thể combine nhiều features với with*()'
          ]
        },
        {
          title: 'Basic HTTP Requests',
          content: `HttpClient trả về Observable cho tất cả các HTTP methods.`,
          code: {
            language: 'typescript',
            filename: 'user.service.ts',
            code: `import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = '/api/users';

  // GET - Lấy danh sách
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  // GET - Lấy một item với params
  getUser(id: number): Observable<User> {
    return this.http.get<User>(\`\${this.apiUrl}/\${id}\`);
  }
// ...
`
          }
        },
        {
          title: 'Headers & Request Options',
          content: `Có thể customize headers, response type, và các options khác cho mỗi request.`,
          code: {
            language: 'typescript',
            filename: 'http-options.ts',
            code: `// Custom headers
const headers = new HttpHeaders()
  .set('Authorization', 'Bearer ' + token)
  .set('Content-Type', 'application/json');

this.http.get<User[]>(url, { headers });

// Response type khác JSON
// 'text' | 'blob' | 'arraybuffer'
this.http.get(url, { responseType: 'text' });

// Download file
downloadFile(id: number): Observable<Blob> {
  return this.http.get(\`/api/files/\${id}\`, {
    responseType: 'blob',
// ...
`
          },
          tips: [
            'HttpHeaders và HttpParams là immutable - các method trả về instance mới',
            'observe: "response" để lấy full HttpResponse với headers',
            'reportProgress: true để track upload/download progress'
          ]
        },
        {
          title: 'Error Handling',
          content: `Xử lý errors đúng cách là quan trọng cho UX tốt.`,
          code: {
            language: 'typescript',
            filename: 'error-handling.ts',
            code: `import { catchError, retry, throwError } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users').pipe(
      retry(2), // Retry 2 lần nếu fail
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

// ...
`
          }
        },
        {
          title: 'HTTP Interceptors',
          content: `Interceptors cho phép xử lý requests/responses ở một nơi tập trung. Angular 15+ sử dụng functional interceptors.`,
          code: {
            language: 'typescript',
            filename: 'interceptors.ts',
            code: `import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
// Auth Interceptor - Thêm token vào mọi request
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', \`Bearer \${token}\`)
    });
    return next(clonedReq);
  }

  return next(req);
};
// ...
`
          },
          tips: [
            'Interceptors chạy theo thứ tự khai báo',
            'Request: chạy từ đầu đến cuối, Response: chạy ngược lại',
            'Phải clone request để modify vì HttpRequest là immutable'
          ]
        },
        {
          title: 'Caching & Optimization',
          content: `Một số techniques để optimize HTTP requests.`,
          code: {
            language: 'typescript',
            filename: 'caching.ts',
            code: `import { shareReplay, Subject, switchMap } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class CachedUserService {
  private http = inject(HttpClient);
  private cache$ = new Map<string, Observable<any>>();
  private refresh$ = new Subject<void>();

  // Cache với shareReplay
  getUsers(): Observable<User[]> {
    const cacheKey = 'users';

    if (!this.cache$.has(cacheKey)) {
      const request$ = this.http.get<User[]>('/api/users').pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
// ...
`
          },
          tips: [
            'shareReplay(1) cache kết quả và share cho tất cả subscribers',
            'switchMap cancel request cũ khi có request mới - tốt cho search',
            'debounceTime giảm số lượng requests khi user đang gõ'
          ]
        }
      ]
    },

    // === PIPES ===
    {
      id: 'pipes',
      title: 'Pipes',
      category: 'pipes',
      icon: '🔧',
      sections: [
        {
          title: 'Pipes là gì?',
          content: `Pipes transform data trong template. Angular có nhiều built-in pipes và cho phép tạo custom pipes.

**Built-in pipes phổ biến:**
- **date**: Format ngày tháng
- **currency**: Format tiền tệ
- **number/decimal**: Format số
- **uppercase/lowercase/titlecase**: Transform text
- **json**: Debug object
- **async**: Subscribe Observable/Promise
- **slice**: Cắt array/string`,
          code: {
            language: 'html',
            filename: 'pipes-example.html',
            code: `<!-- Date Pipe -->
<p>{{ birthday | date }}</p>           <!-- Mar 15, 2024 -->
<p>{{ birthday | date:'short' }}</p>   <!-- 3/15/24, 9:30 AM -->
<p>{{ birthday | date:'fullDate' }}</p> <!-- Friday, March 15, 2024 -->
<p>{{ birthday | date:'dd/MM/yyyy HH:mm' }}</p> <!-- 15/03/2024 09:30 -->

<!-- Currency Pipe -->
<p>{{ price | currency }}</p>          <!-- $123.45 -->
<p>{{ price | currency:'VND' }}</p>    <!-- ₫123 -->
<p>{{ price | currency:'EUR':'symbol':'1.0-0' }}</p> <!-- €123 -->

<!-- Number Pipe -->
<p>{{ pi | number }}</p>               <!-- 3.142 -->
<p>{{ pi | number:'1.0-2' }}</p>       <!-- 3.14 -->
<p>{{ largeNum | number:'1.0-0' }}</p> <!-- 1,234,567 -->
// ...
`
          }
        },
        {
          title: 'Async Pipe',
          content: `Async pipe tự động subscribe/unsubscribe Observable và Promise. Đây là best practice để tránh memory leaks.`,
          code: {
            language: 'typescript',
            filename: 'async-pipe.ts',
            code: `@Component({
  template: \`
    <!-- Basic async -->
    @if (users$ | async; as users) {
      @for (user of users; track user.id) {
        <div>{{ user.name }}</div>
      }
    } @else {
      <p>Loading...</p>
    }

    <!-- Multiple async - dùng object -->
    @if ({
      users: users$ | async,
      config: config$ | async,
  // ...
`
          },
          tips: [
            'Async pipe tự động unsubscribe khi component destroy',
            'Dùng "as" để tránh gọi async pipe nhiều lần trong template',
            'Combine nhiều async pipes với object pattern'
          ]
        },
        {
          title: 'Custom Pipes',
          content: `Tạo custom pipe khi cần transform data theo cách đặc biệt.`,
          code: {
            language: 'typescript',
            filename: 'custom-pipes.ts',
            code: `import { Pipe, PipeTransform } from '@angular/core';
// Pure Pipe - chỉ chạy khi input reference thay đổi
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50, ellipsis = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;
    return value.substring(0, limit) + ellipsis;
  }
}
// Sử dụng: {{ longText | truncate:100:'...' }}

// ...
`
          }
        },
        {
          title: 'Pure vs Impure Pipes',
          content: `Hiểu sự khác biệt giữa Pure và Impure pipes để optimize performance.

**Pure Pipe (default):**
- Chỉ chạy khi input reference thay đổi
- Không chạy khi mutate object/array
- Performance tốt hơn

**Impure Pipe:**
- Chạy mỗi change detection cycle
- Cần thiết khi filter array
- Có thể ảnh hưởng performance`,
          code: {
            language: 'typescript',
            filename: 'pure-impure.ts',
            code: `// PURE PIPE - Không detect mutation
@Pipe({ name: 'filterPure', standalone: true })
export class FilterPurePipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    console.log('Pure pipe executed'); // Chỉ log khi items reference thay đổi
    return items.filter(item => item[field] === value);
  }
}

// Problem với Pure Pipe:
this.items.push(newItem); // Pipe KHÔNG chạy lại!
this.items = [...this.items, newItem]; // Pipe chạy lại ✓

// IMPURE PIPE - Detect mọi thay đổi
@Pipe({
// ...
`
          },
          tips: [
            'Prefer pure pipes + immutable data patterns',
            'Impure pipes chạy rất nhiều lần - cẩn thận với performance',
            'Async pipe là impure nhưng được optimize bởi Angular'
          ]
        }
      ]
    },

    // === CHANGE DETECTION ===
    {
      id: 'change-detection',
      title: 'Change Detection',
      category: 'advanced',
      icon: '🔍',
      sections: [
        {
          title: 'Change Detection là gì?',
          content: `**Change Detection (CD)** là cơ chế Angular dùng để sync data giữa component class và template (DOM).

**Khi nào CD chạy?**
- User events (click, input, submit...)
- HTTP responses
- setTimeout/setInterval
- Promise resolve
- Observable emit

**2 strategies:**
- **Default**: Check tất cả components từ root xuống
- **OnPush**: Chỉ check khi @Input thay đổi hoặc event xảy ra`,
          code: {
            language: 'typescript',
            filename: 'change-detection-basic.ts',
            code: `// Default Strategy - check mọi thứ
@Component({
  template: \`<p>{{ name }}</p>\`
})
export class DefaultComponent {
  name = 'Angular';
  // Mỗi CD cycle, Angular check name có thay đổi không
}

// OnPush Strategy - tối ưu performance
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`<p>{{ user.name }}</p>\`
})
export class OnPushComponent {
// ...
`
          },
          tips: [
            'OnPush + Immutable data = Best performance',
            'Signals tự động trigger CD - không cần markForCheck()',
            'Avoid mutating objects với OnPush - tạo reference mới'
          ]
        },
        {
          title: 'LView & TView Internals (Deep Dive)',
          content: `**Change Detection operates on internal data structures, không phải components.**

**TView (Template View):**
- Static metadata về template (shared across instances)
- Stores: template function, directive defs, binding indices
- Created once per component type

**LView (Logical View):**
- Runtime instance data (one per component instance)
- Array-based structure for performance
- Stores: binding values, element refs, component instance

**Dirty checking algorithm:**
1. For each binding index in LView
2. Compare new value with stored value
3. If different: update DOM, store new value`,
          code: {
            language: 'typescript',
            filename: 'cd-internals.ts',
            code: `// LView structure (simplified)
// Array indices have specific meanings:
// [0]: HOST - host element
// [1]: TVIEW - reference to TView
// [2]: FLAGS - view state flags
// [3]: PARENT - parent LView
// [4]: NEXT - next sibling view
// [5]: TRANSPLANTED_VIEWS_TO_REFRESH
// [6]: T_HOST - TNode for host
// [7]: CLEANUP - cleanup functions
// [8]: CONTEXT - component instance
// [9]: INJECTOR - element injector
// [10]: RENDERER_FACTORY
// [11]: RENDERER
// [12]: SANITIZER
// ...
`
          },
          tips: [
            'LView is an array for performance (faster than object property access)',
            'Binding order in template = binding index in LView',
            'DevTools: ng.getComponent(element) returns component instance'
          ]
        },
        {
          title: 'CD Trigger Mechanism',
          content: `**Zone.js flow:**
1. User interaction → Zone.js intercepts
2. Zone.js runs handler in zone
3. Handler completes → Zone notifies Angular
4. Angular calls ApplicationRef.tick()
5. tick() runs CD from root

**OnPush optimization:**
OnPush component có flag DIRTY trong LView. CD chỉ check nếu flag = dirty.

**Signals bypass Zone:**
Signal changes mark component dirty và schedule CD, không cần Zone.js.`,
          code: {
            language: 'typescript',
            filename: 'cd-trigger.ts',
            code: `// Zone.js monkey-patching (simplified)
const originalSetTimeout = window.setTimeout;
window.setTimeout = function(callback, delay) {
  return originalSetTimeout(() => {
    callback();
    // After callback, notify Angular
    ngZone.onMicrotaskEmpty.emit();  // Triggers CD
  }, delay);
};

// ApplicationRef.tick() implementation (simplified)
class ApplicationRef {
  tick() {
    for (const view of this._views) {
      // Recursive dirty checking
// ...
`
          },
          tips: [
            'OnPush skips entire subtree if not dirty',
            'markForCheck() marks from component to root (all ancestors)',
            'detectChanges() runs CD on subtree only (not ancestors)'
          ]
        },
        {
          title: 'Zoneless & Signals CD',
          content: `**Angular 18+ supports zoneless mode:**
- Không cần Zone.js
- Signals tự trigger CD
- Event handlers tự trigger CD
- Better performance, smaller bundle

**Signal-based CD:**
Khi signal changes:
1. Mark consumer components as dirty
2. Schedule CD via requestAnimationFrame
3. Only check dirty components`,
          code: {
            language: 'typescript',
            filename: 'zoneless.ts',
            code: `// Enable zoneless in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // Replace zone-based CD with signal-based
    provideExperimentalZonelessChangeDetection(),
    // OR: keep Zone but optimize
    // provideZoneChangeDetection({ eventCoalescing: true })
  ]
};

// With zoneless, you MUST use signals or manual trigger
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,  // Recommended
  template: \`
    <p>Count: {{ count() }}</p>
// ...
`
          },
          tips: [
            'Zoneless = smaller bundle (~15KB less)',
            'Migrate to signals before going zoneless',
            'eventCoalescing reduces CD cycles with Zone'
          ]
        },
        {
          title: 'NgZone & runOutsideAngular',
          content: `NgZone cho phép run code outside Angular's zone để avoid triggering CD.`,
          code: {
            language: 'typescript',
            filename: 'ngzone.ts',
            code: `import { NgZone } from '@angular/core';
@Component({
  selector: 'app-animation',
  template: \`
    <div #box class="animated-box"></div>
    <p>Position: {{ position }}</p>
  \`
})
export class AnimationComponent implements OnInit, OnDestroy {
  private zone = inject(NgZone);
  private elementRef = inject(ElementRef);

  position = 0;
  private animationId?: number;

// ...
`
          },
          tips: [
            'runOutsideAngular cho animations, heavy computations',
            'zone.run() để quay lại Angular zone khi cần update view',
            'Signals + OnPush là tương lai của change detection'
          ]
        }
      ]
    },

    // === TESTING ===
    {
      id: 'testing',
      title: 'Testing trong Angular',
      category: 'testing',
      icon: '🧪',
      sections: [
        {
          title: 'Tổng quan Testing',
          content: `Angular có hỗ trợ testing tích hợp sẵn với Jasmine và Karma. Từ Angular 16+, có thể dùng Jest thay thế.

**Các loại tests:**
- **Unit Tests**: Test isolated units (components, services, pipes)
- **Integration Tests**: Test components với dependencies
- **E2E Tests**: Test toàn bộ ứng dụng (Cypress, Playwright)

**Test utilities:**
- **TestBed**: Configure testing module
- **ComponentFixture**: Wrapper để interact với component
- **fakeAsync/tick**: Test async code synchronously
- **HttpClientTestingModule**: Mock HTTP requests`,
          code: {
            language: 'typescript',
            filename: 'basic.spec.ts',
            code: `import { TestBed, ComponentFixture } from '@angular/core/testing';
describe('HelloComponent', () => {
  let component: HelloComponent;
  let fixture: ComponentFixture<HelloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HelloComponent] // Standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(HelloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial change detection
  });

// ...
`
          },
          tips: [
            'Luôn gọi fixture.detectChanges() sau khi thay đổi component state',
            'Dùng async/await hoặc fakeAsync cho async operations',
            'beforeEach với async để compile components có templateUrl'
          ]
        },
        {
          title: 'Testing Services',
          content: `Test services bằng cách inject chúng qua TestBed. Mock dependencies để isolate unit under test.`,
          code: {
            language: 'typescript',
            filename: 'user.service.spec.ts',
            code: `import { TestBed } from '@angular/core/testing';
describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

// ...
`
          }
        },
        {
          title: 'Testing Components với Dependencies',
          content: `Khi component có dependencies (services), cần mock hoặc provide chúng trong TestBed.

**Strategies:**
- **Real service**: Dùng service thật (integration test)
- **Mock service**: Tạo mock object
- **Spy**: Dùng jasmine.createSpyObj()
- **Stub class**: Tạo class stub`,
          code: {
            language: 'typescript',
            filename: 'user-list.component.spec.ts',
            code: `import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
describe('UserListComponent', () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;

  const mockUsers = [
    { id: 1, name: 'John', email: 'john@test.com' },
    { id: 2, name: 'Jane', email: 'jane@test.com' }
  ];

  beforeEach(async () => {
    // Create spy object
    userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'deleteUser'], {
      // Mock signals nếu service dùng signals
// ...
`
          },
          tips: [
            'jasmine.createSpyObj() là cách nhanh nhất để tạo mock',
            'fakeAsync + tick() để test async code một cách synchronous',
            'Dùng fixture.debugElement cho advanced queries'
          ]
        },
        {
          title: 'Testing Forms',
          content: `Test reactive forms và template-driven forms khác nhau về cách tiếp cận.`,
          code: {
            language: 'typescript',
            filename: 'login-form.spec.ts',
            code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

// ...
`
          }
        },
        {
          title: 'Testing với Signals',
          content: `Test components sử dụng Signals cần một số cách tiếp cận đặc biệt.`,
          code: {
            language: 'typescript',
            filename: 'signal-component.spec.ts',
            code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
describe('CounterComponent (Signals)', () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

// ...
`
          },
          tips: [
            'Signals update synchronously - không cần tick() hay waitForAsync',
            'fixture.componentRef.setInput() để set signal inputs',
            'computed values update ngay khi dependencies thay đổi'
          ]
        }
      ]
    },

    // === ANGULAR INTERNALS (SENIOR) ===
    {
      id: 'angular-internals',
      title: 'Angular Internals',
      category: 'advanced',
      icon: '🔬',
      sections: [
        {
          title: 'Ivy Compiler Deep Dive',
          content: `**Ivy** là rendering engine của Angular từ version 9+. Hiểu Ivy giúp bạn debug, optimize, và hiểu tại sao Angular hoạt động như vậy.

**Ivy vs View Engine (cũ):**
- **Locality**: Mỗi component compile độc lập, không cần global analysis
- **Tree-shaking**: Code không dùng được remove
- **Faster compilation**: Incremental builds nhanh hơn
- **Smaller bundles**: Chỉ include code thực sự cần

**Ivy compilation process:**
1. **Template parsing**: Parse HTML template thành AST
2. **Type checking**: Kiểm tra types trong template
3. **Template instruction generation**: Generate render functions
4. **Component definition**: Tạo ComponentDef với all metadata`,
          code: {
            language: 'typescript',
            filename: 'ivy-internals.ts',
            code: `// Component sau khi Ivy compile (simplified)
// Angular CLI generate code này, không phải bạn viết

// Trước compile:
@Component({
  selector: 'app-hello',
  template: \`<h1>Hello {{ name }}!</h1>\`
})
export class HelloComponent {
  name = 'World';
}

// Sau Ivy compile (dạng simplified):
class HelloComponent {
  name = 'World';
// ...
`
          },
          tips: [
            'ɵɵ prefix (theta theta) indicate internal Angular APIs',
            'RenderFlags.Create chỉ chạy 1 lần, Update chạy mỗi CD',
            'Hiểu Ivy instructions giúp debug template issues'
          ]
        },
        {
          title: 'Zone.js Mechanics',
          content: `**Zone.js** là library tạo execution context cho async operations. Angular dùng Zone.js để tự động trigger change detection.

**Zone.js hoạt động như thế nào?**
Zone.js **monkey-patch** các async APIs của browser:
- setTimeout/setInterval
- Promise
- addEventListener
- XMLHttpRequest/fetch
- requestAnimationFrame

Khi async operation complete, Zone notify Angular để run change detection.

**NgZone** là Angular's wrapper around Zone.js, cung cấp:
- run(): Chạy code trong Angular zone
- runOutsideAngular(): Chạy code NGOÀI Angular zone
- onMicrotaskEmpty: Observable emit khi microtask queue empty`,
          code: {
            language: 'typescript',
            filename: 'zone-mechanics.ts',
            code: `// Zone.js monkey-patching (simplified concept)
// Đây là cách Zone.js wrap setTimeout

const originalSetTimeout = window.setTimeout;

window.setTimeout = function(callback, delay) {
  const zone = Zone.current;

  return originalSetTimeout(function() {
    // Chạy callback trong zone đã capture
    zone.run(callback);
  }, delay);
};

// Khi callback chạy trong zone, zone có thể:
// ...
`
          },
          tips: [
            'Zone.js là lý do bạn không cần gọi detectChanges() manually thường xuyên',
            'runOutsideAngular() crucial cho animations, WebSocket, heavy loops',
            'Angular 18+ có experimental zoneless mode với Signals'
          ]
        },
        {
          title: 'Change Detection Internals',
          content: `Change Detection (CD) là quá trình Angular sync model với view. Hiểu CD sâu giúp optimize performance.

**CD Process:**
1. Event trigger (click, HTTP, timer...)
2. Zone.js notify Angular
3. ApplicationRef.tick() được gọi
4. Check root component
5. Check all descendants (top-down)
6. Update DOM nếu có thay đổi

**Dirty checking:**
Angular không track changes như Vue/MobX. Thay vào đó, Angular CHECK mọi binding expression mỗi CD cycle.

**LView & TView:**
- **TView** (Template View): Static data, shared giữa instances
- **LView** (Logical View): Instance data, mỗi component instance có 1 LView`,
          code: {
            language: 'typescript',
            filename: 'change-detection-internals.ts',
            code: `// Change Detection pseudo-code (simplified)
function detectChangesForComponent(component, view) {
  // 1. Check nếu component marked dirty (OnPush)
  if (view.flags & ViewFlags.ChecksEnabled) {

    // 2. Update input bindings
    updateInputBindings(component, view);

    // 3. Call lifecycle hooks
    callHook(component, 'ngDoCheck');

    // 4. Update DOM bindings
    // Đây là phần expensive nhất
    for (let i = 0; i < view.bindingCount; i++) {
      const oldValue = view.oldValues[i];
// ...
`
          },
          tips: [
            'OnPush + Immutable data = Optimal performance',
            'ExpressionChangedAfterItHasBeenCheckedError chỉ có trong dev mode',
            'Signals bypass dirty checking - future của Angular CD'
          ]
        },
        {
          title: 'Dependency Injection Internals',
          content: `Angular DI system phức tạp và powerful. Hiểu internals giúp debug injection issues và design services tốt hơn.

**Injector Hierarchy:**
1. **NullInjector**: Top, throws error nếu không tìm thấy
2. **PlatformInjector**: Platform-level (platform services)
3. **RootInjector**: App-level (providedIn: 'root')
4. **ModuleInjector**: NgModule-level (NgModule providers)
5. **ElementInjector**: Component-level (component providers)

**Resolution Algorithm:**
1. Start từ ElementInjector của component
2. Walk up ElementInjector hierarchy
3. Cross to ModuleInjector
4. Walk up ModuleInjector hierarchy
5. Reach NullInjector -> throw error

**Multi Providers & Injection Tokens:**
- InjectionToken: Type-safe token for non-class dependencies
- Multi: true: Multiple providers cho same token`,
          code: {
            language: 'typescript',
            filename: 'di-internals.ts',
            code: `// Injector Resolution (pseudo-code)
function resolveToken(token: any, injector: Injector): any {
  let currentInjector = injector;

  while (currentInjector !== null) {
    // Check current injector's records
    const record = currentInjector.records.get(token);

    if (record !== undefined) {
      // Found! Return or create instance
      if (record.value === CIRCULAR) {
        throw new Error('Circular dependency detected');
      }

      if (record.value === NOT_YET_CREATED) {
// ...
`
          },
          tips: [
            'providedIn: "root" là tree-shakable - service chỉ include nếu used',
            'ElementInjector có priority cao hơn ModuleInjector',
            'forwardRef() giải quyết circular nhưng cần xem lại design'
          ]
        },
        {
          title: 'Signals Under the Hood',
          content: `Signals là reactive primitives mới. Hiểu cách chúng hoạt động internally giúp sử dụng hiệu quả hơn.

**Signal Graph:**
Signals tạo thành directed acyclic graph (DAG):
- Nodes: signal(), computed()
- Edges: Dependencies

**Reactive Algorithm:**
1. **Push-based notification**: Khi signal.set(), mark dependents dirty
2. **Pull-based evaluation**: computed() chỉ recalculate khi được đọc

**Glitch-free:**
Computed values luôn consistent - không bao giờ thấy intermediate states.`,
          code: {
            language: 'typescript',
            filename: 'signals-internals.ts',
            code: `// Signal implementation concept (simplified)
interface ReactiveNode {
  value: any;
  version: number;
  dependents: Set<ReactiveNode>;
  dependencies: Set<ReactiveNode>;
  dirty: boolean;
  compute?: () => any;
}

// Writable Signal
function createSignal<T>(initialValue: T): WritableSignal<T> {
  const node: ReactiveNode = {
    value: initialValue,
    version: 0,
// ...
`
          },
          tips: [
            'Signals là push notification + pull evaluation = efficient',
            'computed() lazy - chỉ calculate khi được đọc',
            'effect() eager - schedule run ngay khi dependency thay đổi'
          ]
        },
        {
          title: 'Tree Shaking & Bundle Optimization',
          content: `Tree shaking loại bỏ code không sử dụng. Angular Ivy được design để tree-shakable.

**Tại sao Ivy tree-shakable:**
- **Locality**: Mỗi component self-contained
- **Generated code**: Template instructions import explicitly
- **Static analysis**: Build tools có thể determine usage

**Bundle Analysis:**
Hiểu bundle composition giúp optimize size.`,
          code: {
            language: 'typescript',
            filename: 'tree-shaking.ts',
            code: `// providedIn: 'root' là tree-shakable
@Injectable({
  providedIn: 'root' // Chỉ include nếu được inject ở đâu đó
})
export class UserService {}

// NgModule providers KHÔNG tree-shakable
@NgModule({
  providers: [UserService] // Luôn include dù không dùng
})

// Ivy template instructions tree-shaking
// Nếu không dùng *ngIf, ɵɵtemplate instruction không include

// Component với ngIf
// ...
`
          },
          tips: [
            'Dùng providedIn: "root" thay vì NgModule providers',
            'Import cụ thể: import { map } from "rxjs" không phải import * as rxjs',
            'Lazy load heavy features và third-party libraries'
          ]
        }
      ]
    },

    // === ARCHITECTURE PATTERNS (SENIOR) ===
    {
      id: 'architecture-patterns',
      title: 'Architecture Patterns',
      category: 'advanced',
      icon: '🏗️',
      sections: [
        {
          title: 'Smart vs Dumb Components',
          content: `Pattern fundamental để build scalable Angular apps.

**Smart Components (Container):**
- Biết về services, state
- Handle business logic
- Fetch data
- Dispatch actions

**Dumb Components (Presentational):**
- Chỉ biết @Input/@Output
- Không inject services (trừ UI services)
- Pure rendering
- Highly reusable
- Easy to test

**Lợi ích:**
- Separation of concerns
- Reusability
- Testability
- Performance (OnPush friendly)`,
          code: {
            language: 'typescript',
            filename: 'smart-dumb.ts',
            code: `// ========== DUMB COMPONENT ==========
// Chỉ nhận data và emit events
@Component({
  selector: 'app-user-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="card">
      <img [src]="user().avatar" [alt]="user().name">
      <h3>{{ user().name }}</h3>
      <p>{{ user().email }}</p>
      <button (click)="edit.emit(user())">Edit</button>
      <button (click)="delete.emit(user().id)">Delete</button>
    </div>
  \`
// ...
`
          },
          tips: [
            'Dumb components nên dùng OnPush - dễ optimize',
            'Smart components thường là routed components',
            'Ratio lý tưởng: ~20% smart, 80% dumb'
          ]
        },
        {
          title: 'State Management Patterns',
          content: `Quản lý state hiệu quả là key cho large-scale apps.

**Levels of state:**
1. **Component state**: Local, ephemeral
2. **Feature state**: Shared trong feature
3. **Application state**: Global, persisted

**Patterns:**
- **Signals Store**: Built-in, simple
- **NgRx**: Redux pattern, complex apps
- **NGXS**: Redux alternative, less boilerplate
- **Services with Signals**: Medium complexity`,
          code: {
            language: 'typescript',
            filename: 'state-patterns.ts',
            code: `// ========== PATTERN 1: Signal-based Store ==========
// Simple, built-in, great for most apps

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
  loading: boolean;
}

@Injectable({ providedIn: 'root' })
export class TodoStore {
  // Private state
  private state = signal<TodoState>({
    todos: [],
    filter: 'all',
// ...
`
          },
          tips: [
            'Start simple với Signal stores, scale lên NgRx nếu cần',
            'Feature stores isolate state cho từng feature',
            'Computed signals cho derived state - auto-update và cached'
          ]
        },
        {
          title: 'Facade Pattern',
          content: `Facade pattern abstract complexity và provide simple API cho components.

**Benefits:**
- Components không cần biết về state management internals
- Easy to refactor backend (store, services)
- Single point of access
- Better testability`,
          code: {
            language: 'typescript',
            filename: 'facade-pattern.ts',
            code: `// Facade hides complexity từ components
@Injectable({ providedIn: 'root' })
export class UserFacade {
  private store = inject(UserStore);
  private api = inject(UserApiService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // Expose only what components need
  readonly users = this.store.users;
  readonly selectedUser = this.store.selectedUser;
  readonly loading = this.store.loading;
  readonly error = this.store.error;

  // Computed for UI
// ...
`
          },
          tips: [
            'Facade là single source of truth cho feature',
            'Components chỉ interact với Facade, không với Store trực tiếp',
            'Facade handle cross-cutting concerns (notifications, navigation)'
          ]
        },
        {
          title: 'Domain-Driven Design in Angular',
          content: `Apply DDD concepts để structure large Angular applications.

**Key Concepts:**
- **Bounded Context**: Feature modules với clear boundaries
- **Aggregates**: Group of entities treated as unit
- **Domain Services**: Business logic
- **Application Services**: Use case orchestration

**Folder Structure:**
Organize by domain, not by type.`,
          code: {
            language: 'text',
            filename: 'ddd-structure.txt',
            code: `# Domain-Driven Folder Structure
src/
├── app/
│   ├── core/                    # Application core
│   │   ├── auth/                # Auth domain
│   │   │   ├── domain/
│   │   │   │   ├── user.model.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── infrastructure/
│   │   │   │   ├── auth-api.service.ts
│   │   │   │   └── token-storage.service.ts
│   │   │   └── index.ts
│   │   └── guards/
│   │
│   ├── features/                # Feature modules (Bounded Contexts)
// ...
    `
          },
          tips: [
            'Feature folder = Bounded Context',
            'Domain layer không depend vào infrastructure',
            'Public API qua index.ts - encapsulation'
          ]
        },
        {
          title: 'Performance Patterns',
          content: `Patterns và techniques để optimize Angular app performance.

**Key Areas:**
1. Change Detection optimization
2. Bundle size reduction
3. Runtime performance
4. Memory management`,
          code: {
            language: 'typescript',
            filename: 'performance-patterns.ts',
            code: `// ========== CHANGE DETECTION OPTIMIZATION ==========
// 1. OnPush everywhere possible
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  ...
})

// 2. trackBy for ngFor / track for @for
@for (item of items; track item.id) {
  <app-item [item]="item" />
}

// 3. Pure pipes instead of method calls in template
// BAD - runs every CD cycle
<div>{{ formatDate(item.date) }}</div>
// ...
`
          },
          tips: [
            'Measure before optimize - dùng Angular DevTools',
            'OnPush + Immutable + Signals = Optimal CD',
            '@defer giảm initial bundle size significantly'
          ]
        }
      ]
    },

    // === NGMODULE (LEGACY) ===
    {
      id: 'ngmodule',
      title: 'NgModule (Legacy)',
      category: 'legacy',
      icon: '📦',
      sections: [
        {
          title: 'NgModule là gì?',
          content: `NgModule là cách Angular truyền thống để tổ chức ứng dụng thành các modules. Mặc dù Angular 17+ khuyến khích dùng standalone components, nhưng nhiều dự án cũ vẫn sử dụng NgModule.

**Một NgModule khai báo:**
- **declarations**: Components, directives, pipes thuộc module này
- **imports**: Các modules khác cần dùng
- **exports**: Components/directives/pipes để share ra ngoài
- **providers**: Services provide ở module level
- **bootstrap**: Root component (chỉ dùng ở AppModule)`,
          code: {
            language: 'typescript',
            filename: 'app.module.ts',
            code: `import { NgModule } from '@angular/core';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UserListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
`
          },
          tips: [
            'Mỗi component chỉ được declare trong MỘT module',
            'Để share component, phải exports nó từ module',
            'Feature modules giúp tổ chức code theo tính năng'
          ]
        },
        {
          title: 'Feature Modules',
          content: `Trong dự án lớn, nên tách thành các feature modules để dễ quản lý và lazy loading.`,
          code: {
            language: 'typescript',
            filename: 'users.module.ts',
            code: `// Feature Module
@NgModule({
  declarations: [
    UserListComponent,
    UserDetailComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: UserListComponent },
      { path: ':id', component: UserDetailComponent }
    ])
  ],
// ...
`
          }
        },
        {
          title: 'Shared Module Pattern',
          content: `SharedModule chứa các components, directives, pipes được dùng chung nhiều nơi.`,
          code: {
            language: 'typescript',
            filename: 'shared.module.ts',
            code: `@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    AlertComponent,
    HighlightDirective,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // Export tất cả để dùng lại
    CommonModule,
  // ...
`
          },
          tips: [
            'Không provide services trong SharedModule (gây multiple instances)',
            'Services nên providedIn: "root" hoặc trong CoreModule',
            'SharedModule chỉ nên chứa "dumb" components'
          ]
        }
      ]
    },

    // === LEGACY DIRECTIVES ===
    {
      id: 'legacy-directives',
      title: '*ngIf, *ngFor (Legacy)',
      category: 'legacy',
      icon: '🏛️',
      sections: [
        {
          title: '*ngIf - Conditional Rendering',
          content: `*ngIf là structural directive truyền thống để render có điều kiện. Angular 17+ thay thế bằng @if nhưng *ngIf vẫn hoạt động.`,
          code: {
            language: 'html',
            filename: 'ngif-examples.html',
            code: `<!-- Basic *ngIf -->
<div *ngIf="isLoggedIn">Welcome back!</div>

<!-- *ngIf với else -->
<div *ngIf="user; else noUser">
  Hello, {{ user.name }}!
</div>
<ng-template #noUser>
  <p>Please login</p>
</ng-template>

<!-- *ngIf với then và else -->
<div *ngIf="isLoading; then loadingTpl; else contentTpl"></div>
<ng-template #loadingTpl>Loading...</ng-template>
<ng-template #contentTpl>Content loaded!</ng-template>
// ...
`
          },
          tips: [
            '*ngIf XÓA element khỏi DOM khi false (khác với [hidden])',
            'Dùng "as" để tránh gọi async pipe nhiều lần',
            'ng-template không render - chỉ là template reference'
          ]
        },
        {
          title: '*ngFor - Loop Rendering',
          content: `*ngFor dùng để render danh sách. Angular 17+ thay thế bằng @for với track bắt buộc.`,
          code: {
            language: 'html',
            filename: 'ngfor-examples.html',
            code: `<!-- Basic *ngFor -->
<ul>
  <li *ngFor="let item of items">{{ item.name }}</li>
</ul>

<!-- *ngFor với index -->
<div *ngFor="let item of items; let i = index">
  {{ i + 1 }}. {{ item.name }}
</div>

<!-- *ngFor với các biến local -->
<div *ngFor="let item of items;
             let i = index;
             let first = first;
             let last = last;
// ...
`
          },
          tips: [
            'LUÔN dùng trackBy để tránh re-render toàn bộ list',
            'trackBy return unique identifier, không phải index',
            '@for trong Angular 17+ BẮT BUỘC phải có track'
          ]
        },
        {
          title: '*ngSwitch',
          content: `*ngSwitch dùng khi có nhiều conditions. Angular 17+ thay thế bằng @switch.`,
          code: {
            language: 'html',
            filename: 'ngswitch-examples.html',
            code: `<!-- *ngSwitch cũ -->
<div [ngSwitch]="status">
  <p *ngSwitchCase="'active'">User is active</p>
  <p *ngSwitchCase="'pending'">User is pending</p>
  <p *ngSwitchCase="'banned'">User is banned</p>
  <p *ngSwitchDefault>Unknown status</p>
</div>

<!-- Có thể dùng với expressions -->
<div [ngSwitch]="user.role">
  <admin-panel *ngSwitchCase="'admin'"></admin-panel>
  <user-dashboard *ngSwitchCase="'user'"></user-dashboard>
  <guest-view *ngSwitchDefault></guest-view>
</div>

// ...
`
          }
        }
      ]
    },

    // === OLD VS NEW COMPARISON ===
    {
      id: 'old-vs-new',
      title: 'So Sánh Cũ vs Mới',
      category: 'comparison',
      icon: '🔄',
      sections: [
        {
          title: 'NgModule vs Standalone',
          content: `Angular đang chuyển từ NgModule-based sang Standalone components. Hiểu cả hai giúp bạn làm việc với legacy code và code mới.`,
          code: {
            language: 'typescript',
            filename: 'module-vs-standalone.ts',
            code: `// ========== CŨ: NgModule-based ==========
// app.module.ts
@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}

// main.ts
platformBrowserDynamic().bootstrapModule(AppModule);

// header.component.ts
@Component({
  selector: 'app-header',
// ...
`
          },
          tips: [
            'Standalone components import trực tiếp dependencies họ cần',
            'Không cần NgModule wrapper nữa',
            'Có thể mix standalone và NgModule trong cùng project'
          ]
        },
        {
          title: 'Control Flow: *ngIf vs @if',
          content: `Angular 17 giới thiệu built-in control flow syntax mới, đẹp hơn và performance tốt hơn.`,
          code: {
            language: 'html',
            filename: 'control-flow-comparison.html',
            code: `<!-- ========== CŨ: Structural Directives ========== -->
<!-- *ngIf -->
<div *ngIf="user; else noUser">{{ user.name }}</div>
<ng-template #noUser>No user</ng-template>

<!-- *ngFor -->
<li *ngFor="let item of items; trackBy: trackByFn">{{ item.name }}</li>

<!-- *ngSwitch -->
<div [ngSwitch]="status">
  <span *ngSwitchCase="'active'">Active</span>
  <span *ngSwitchDefault>Unknown</span>
</div>

<!-- ========== MỚI: Built-in Control Flow ========== -->
// ...
`
          },
          tips: [
            '@for BẮT BUỘC có track - tốt cho performance',
            '@empty block thay thế việc check array.length',
            'Cú pháp mới clean hơn, không cần ng-template'
          ]
        },
        {
          title: 'DI: Constructor vs inject()',
          content: `Angular 14+ giới thiệu inject() function, cách mới để inject dependencies.`,
          code: {
            language: 'typescript',
            filename: 'di-comparison.ts',
            code: `// ========== CŨ: Constructor Injection ==========
@Component({...})
export class UserComponent {
  constructor(
    private userService: UserService,
    private http: HttpClient,
    private router: Router,
    @Optional() private logger?: LoggerService
  ) {}

  loadUsers() {
    this.userService.getUsers().subscribe(...);
  }
}

// ...
`
          },
          tips: [
            'inject() chỉ dùng trong injection context',
            'inject() cho phép dùng DI trong functions, không chỉ classes',
            'Giúp code gọn hơn khi có nhiều dependencies'
          ]
        },
        {
          title: 'State: RxJS vs Signals',
          content: `Signals là cách mới để quản lý reactive state, đơn giản hơn RxJS cho nhiều use cases.`,
          code: {
            language: 'typescript',
            filename: 'rxjs-vs-signals.ts',
            code: `// ========== CŨ: RxJS BehaviorSubject ==========
@Component({...})
export class CounterComponent implements OnDestroy {
  private countSubject = new BehaviorSubject<number>(0);
  count$ = this.countSubject.asObservable();
  doubled$ = this.count$.pipe(map(n => n * 2));

  private destroy$ = new Subject<void>();

  increment() {
    this.countSubject.next(this.countSubject.value + 1);
  }

  ngOnDestroy() {
    this.destroy$.next();
// ...
`
          },
          tips: [
            'Signals không cần subscribe/unsubscribe',
            'Dùng RxJS cho async operations, Signals cho sync state',
            'toSignal() và toObservable() giúp interop'
          ]
        },
        {
          title: 'Migration Strategy',
          content: `Khi upgrade dự án cũ lên Angular mới, có thể làm từng bước.`,
          code: {
            language: 'typescript',
            filename: 'migration.ts',
            code: `// BƯỚC 1: Chuyển từng component sang standalone
// Thêm standalone: true và imports
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-list.component.html'
})
export class UserListComponent {}

// BƯỚC 2: Import standalone component vào NgModule
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
// ...
`
          },
          tips: [
            'Không cần migrate tất cả cùng lúc',
            'Standalone và NgModule có thể tồn tại song song',
            'Angular CLI có schematics hỗ trợ migration'
          ]
        }
      ]
    }
  ];

  // Signals
  private _selectedLesson = signal<Lesson | null>(null);
  private _currentSectionIndex = signal(0);

  // Public
  readonly lessons = this._lessonsData;
  readonly selectedLesson = this._selectedLesson.asReadonly();
  readonly currentSectionIndex = this._currentSectionIndex.asReadonly();

  currentSection = computed(() => {
    const lesson = this._selectedLesson();
    const index = this._currentSectionIndex();
    return lesson?.sections[index] ?? null;
  });

  totalSections = computed(() => {
    return this._selectedLesson()?.sections.length ?? 0;
  });

  selectLesson(lessonId: string): void {
    const lesson = this.lessons.find(l => l.id === lessonId) || null;
    this._selectedLesson.set(lesson);
    this._currentSectionIndex.set(0);
  }

  nextSection(): boolean {
    const total = this.totalSections();
    const current = this._currentSectionIndex();
    if (current < total - 1) {
      this._currentSectionIndex.set(current + 1);
      return true;
    }
    return false;
  }

  prevSection(): boolean {
    const current = this._currentSectionIndex();
    if (current > 0) {
      this._currentSectionIndex.set(current - 1);
      return true;
    }
    return false;
  }

  goToSection(index: number): void {
    if (index >= 0 && index < this.totalSections()) {
      this._currentSectionIndex.set(index);
    }
  }

  closeLesson(): void {
    this._selectedLesson.set(null);
    this._currentSectionIndex.set(0);
  }

  getLessonsByCategory(category: string): Lesson[] {
    if (category === 'all') return this.lessons;
    return this.lessons.filter(l => l.category === category);
  }

  // Navigation giữa các bài
  nextLesson = computed(() => {
    const current = this._selectedLesson();
    if (!current) return null;
    const currentIndex = this.lessons.findIndex(l => l.id === current.id);
    return this.lessons[currentIndex + 1] || null;
  });

  prevLesson = computed(() => {
    const current = this._selectedLesson();
    if (!current) return null;
    const currentIndex = this.lessons.findIndex(l => l.id === current.id);
    return this.lessons[currentIndex - 1] || null;
  });

  goToNextLesson(): void {
    const next = this.nextLesson();
    if (next) {
      this.selectLesson(next.id);
    }
  }

  goToPrevLesson(): void {
    const prev = this.prevLesson();
    if (prev) {
      this.selectLesson(prev.id);
    }
  }

  isLastSection = computed(() => {
    return this._currentSectionIndex() >= this.totalSections() - 1;
  });
}
