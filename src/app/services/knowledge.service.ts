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
          content: `**Angular** là **full-featured framework** cho SPA, phát triển bởi Google. Khác biệt cốt lõi so với React/Vue: Angular là **platform** chứ không chỉ là UI library.

**Tại sao chọn Angular cho enterprise?**
- **Opinionated Architecture**: Convention over configuration - team 50 người vẫn consistent
- **TypeScript First**: Strict typing, refactoring an toàn, IntelliSense mạnh
- **Full Package**: Router, Forms, HTTP, Testing, i18n, Animations đều built-in
- **Long-term Support**: Mỗi major version được support 18 tháng
- **Google backing**: Gmail, Google Cloud Console, Firebase Console đều dùng Angular

**Angular vs React vs Vue - honest comparison:**
| Aspect | Angular | React | Vue |
|--------|---------|-------|-----|
| Type | Full Framework | UI Library | Progressive Framework |
| Language | TypeScript bắt buộc | JSX + optional TS | SFC + optional TS |
| Rendering | Incremental DOM (Ivy) | Virtual DOM | Virtual DOM (Vapor mode) |
| State | Signals + RxJS built-in | External (Redux/Zustand) | Composition API |
| Bundle (Hello World) | ~45KB | ~40KB | ~16KB |
| Khi nào dùng | Enterprise, large teams | Flexible, ecosystem lớn | Rapid dev, learning curve thấp |

**Kiến trúc cốt lõi Angular:**
- **Ivy Compiler**: Template → JS instructions, tree-shakable, không Virtual DOM
- **Zone.js**: Auto-trigger change detection qua monkey-patching async APIs
- **Hierarchical DI**: Injector tree song song component tree
- **Signals (17+)**: Fine-grained reactivity, tương lai thay thế Zone.js`,
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
            'Angular 17+ là phiên bản khuyên dùng - standalone by default, không cần NgModule',
            'ng new --dry-run để preview trước khi tạo files',
            'SSR/SSG nay dùng @angular/ssr thay cho Angular Universal (deprecated)',
            'Versioning: Angular 17 (Nov 2023), 18 (May 2024), 19 (Nov 2024) - mỗi 6 tháng 1 major'
          ]
        },
        {
          title: 'Kiến trúc Angular (Deep Dive)',
          content: `**Tại sao Angular thiết kế như vậy? - Hiểu trade-offs**

Angular là **opinionated framework** - enforce kiến trúc cụ thể. Đây là **design choice có chủ đích** cho large-scale enterprise apps.

**5 pillars kiến trúc Angular:**

**1. Ivy Compiler (Incremental DOM)**
Không dùng Virtual DOM như React. Thay vào đó, compile template thành JS instructions trực tiếp manipulate DOM. Ưu điểm: tree-shakable (chỉ include instructions thực sự dùng), memory footprint thấp hơn vDOM.

**2. Zone.js (Auto Change Detection)**
Monkey-patch TẤT CẢ async APIs (setTimeout, Promise, addEventListener, XHR...). Khi async operation hoàn tất → auto trigger CD. Trade-off: magic nhưng có overhead ~5-10% performance.

**3. Hierarchical DI (Injector Tree)**
2 loại injector song song: EnvironmentInjector (module/app level) và ElementInjector (component tree). Service có thể scoped theo subtree → mỗi lazy-loaded route có riêng service instances.

**4. Decorator Metadata (@Component, @Injectable)**
TypeScript decorators + reflect-metadata lưu config tại compile time. Ivy transform decorators thành static fields (ɵcmp, ɵinj) trên class.

**5. Reactive System (Signals + RxJS)**
Signals (Angular 16+) cho synchronous UI state. RxJS cho async streams. Không thay thế nhau mà **bổ sung**: Signals cho derived state, RxJS cho event streams.

**Evolution: Angular 17-19 major shifts**
| Feature | Cũ | Mới (17+) |
|---------|-----|-----------|
| Module system | NgModule | Standalone components |
| Reactivity | Zone.js only | Signals + optional Zone.js |
| Control flow | *ngIf, *ngFor | @if, @for (compile-time) |
| Lazy loading | loadChildren | @defer (template-level) |
| SSR | Angular Universal | @angular/ssr + hydration |`,
          tips: [
            'Ivy generate ~40% less code so với View Engine - bundle nhỏ hơn đáng kể',
            'Zone.js đã optional từ Angular 18 (experimental) và stable từ v20 - dùng provideZonelessChangeDetection()',
            'Standalone components KHÔNG phải "NgModule đơn giản hóa" - nó là architectural paradigm shift',
            'Angular 21+ Signal Forms (experimental) - xu hướng đẩy mạnh Signals thay thế RxJS cho UI state'
          ]
        },
        {
          title: 'Build System Internals',
          content: `**Angular CLI Build System - esbuild era**

Angular 17+ chuyển sang **esbuild + Vite** cho dev server, thay thế webpack. Build nhanh hơn 2-4x cho production, 10-20x cho dev.

**Build pipeline chi tiết:**
1. **TypeScript Compiler (tsc)**: TS → JS, type checking
2. **Ivy Template Compiler (ngtsc)**: Template HTML → render instructions (ɵɵ functions)
3. **esbuild Bundler**: Tree-shaking, code splitting, ESM output
4. **Terser**: Minification, dead code elimination
5. **Asset Processing**: SCSS → CSS, image optimization, i18n

**2 builder options trong angular.json:**
- \`@angular-devkit/build-angular:application\` (mới, esbuild) - **recommended**
- \`@angular-devkit/build-angular:browser\` (cũ, webpack) - legacy support

**Bundle Budgets - CI quality gate:**
Budget violations nên là **error** (không phải warning) trong CI/CD. Angular default:
- Initial bundle: warning 500KB, error 1MB
- Any component style: warning 4KB

**Quan trọng:** \`browser\` field thay \`main\` trong angular.json mới. \`polyfills\` là array thay vì file path. \`fileReplacements\` dùng cho environment-specific configs.`,
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
          content: `**Bootstrap Process - từ main.ts đến rendered UI**

\`bootstrapApplication()\` là entry point của mọi Angular app. Nó khởi tạo toàn bộ runtime:

**5 bước bootstrap:**
1. **Create PlatformRef**: Singleton, chứa Zone.js instance và platform injector
2. **Create ApplicationRef**: Quản lý component tree, trigger CD, handle errors
3. **Build Injector Hierarchy**: PlatformInjector → EnvironmentInjector (providers từ app.config) → ElementInjector (component tree)
4. **Compile Root Component**: Ivy compile template thành render function, tạo LView/TView
5. **Render & Attach**: Tạo DOM nodes, attach event listeners, insert vào \`<app-root>\`

**Injector Hierarchy (critical to understand):**
\`\`\`
PlatformInjector (singleton - PLATFORM_ID, etc.)
  └── EnvironmentInjector (app.config providers - Router, HttpClient, etc.)
      └── ElementInjector (component-level providers, từ @Component({ providers: [...] }))
\`\`\`

**app.config.ts - provider functions quan trọng:**
| Provider | Chức năng | Options |
|----------|-----------|---------|
| \`provideRouter()\` | Setup Router | withViewTransitions(), withComponentInputBinding() |
| \`provideHttpClient()\` | Setup HTTP | withFetch(), withInterceptors([...]) |
| \`provideAnimationsAsync()\` | Lazy animations | Giảm initial bundle |
| \`provideZoneChangeDetection()\` | Zone.js config | eventCoalescing: true (giảm CD cycles) |

**Tip quan trọng:** \`eventCoalescing: true\` merge multiple events trong cùng microtask thành 1 CD cycle - giảm đáng kể số lần CD chạy.`,
          code: {
            language: 'typescript',
            filename: 'main.ts + app.config.ts',
            code: `// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      withViewTransitions(),         // Smooth page transitions
      withComponentInputBinding(),   // Route params → @Input()
      withRouterConfig({ onSameUrlNavigation: 'reload' })
    ),
    provideHttpClient(
      withFetch(),                   // Fetch API thay XHR (tốt cho SSR)
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAnimationsAsync(),        // Lazy-load animation code
    // provideZonelessChangeDetection()  // Angular 18+ zoneless
  ]
};`
          },
          tips: [
            'eventCoalescing: true có thể giảm 30-50% số lần CD chạy trong interaction-heavy apps',
            'withFetch() bắt buộc cho SSR hydration - XHR không work tốt server-side',
            'withComponentInputBinding() cho phép route params tự động bind vào @Input() - không cần ActivatedRoute',
            'provideAnimationsAsync() tách animation code ra separate chunk - giảm initial bundle ~60KB'
          ]
        },
        {
          title: 'Compilation Pipeline',
          content: `**Ivy Compiler - từ Template đến DOM instructions**

Template Angular KHÔNG phải HTML. Nó là **DSL (Domain-Specific Language)** được compile thành JavaScript render functions.

**4 giai đoạn compilation:**
1. **Parse**: Template string → Abstract Syntax Tree (AST) với nodes cho elements, bindings, directives
2. **Analyze**: Type-check expressions, resolve component/directive selectors, validate bindings
3. **Transform**: AST → Ivy template instructions (ɵɵelementStart, ɵɵtext, ɵɵproperty, etc.)
4. **Emit**: Generate JavaScript + .d.ts definition files

**Tại sao Ivy dùng Incremental DOM thay Virtual DOM?**
- **Virtual DOM (React)**: Tạo full virtual tree → diff → patch real DOM. Memory: O(tree_size)
- **Incremental DOM (Ivy)**: Generate instructions trực tiếp, không tạo intermediate tree. Memory: O(changes_only)
- Kết quả: Ivy memory footprint thấp hơn, especially cho large templates ít thay đổi

**AOT vs JIT compilation:**
| Aspect | AOT (production) | JIT (dev only) |
|--------|------------------|----------------|
| When | Build time | Runtime in browser |
| Bundle | Nhỏ (no compiler) | Lớn (+compiler ~100KB) |
| Errors | Caught at build | Caught at runtime |
| Startup | Nhanh | Chậm (phải compile) |
| Default | Angular 9+ | Chỉ khi cần dev |

**Template Type Checking (tsconfig.json):**
- \`strictTemplates: true\`: Type-check bindings, detect undefined properties, null safety
- \`strictInputAccessModifiers\`: Respect private/protected inputs trong template
- \`strictNullInputTypes\`: Check null/undefined cho input bindings`,
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
          content: `**Binding Mechanics - compile thành gì?**

Mỗi loại binding compile thành Ivy instructions khác nhau:
| Template Syntax | Ivy Instruction | Khi nào chạy |
|-----------------|-----------------|--------------|
| \`{{ expr }}\` | \`ɵɵtextInterpolate(expr)\` | Mỗi CD cycle |
| \`[prop]="expr"\` | \`ɵɵproperty("prop", expr)\` | Mỗi CD cycle |
| \`(event)="handler()"\` | \`ɵɵlistener("event", fn)\` | Một lần (create phase) |
| \`[(ngModel)]\` | Desugar: \`[ngModel] + (ngModelChange)\` | Cả hai |

**Dirty Checking - cách Angular detect changes:**
Mỗi binding có **index trong LView array**. CD cycle so sánh \`newValue !== oldValue\` (strict equality). Nếu khác → update DOM + lưu newValue vào LView.

**Performance traps thường gặp:**
1. **Function calls in template**: \`{{ getFullName() }}\` chạy MỖI CD cycle (5-10 lần per click). Dùng computed signal hoặc pure pipe thay thế
2. **Object literals**: \`[config]="{ theme: 'dark' }"\` tạo reference MỚI mỗi CD → OnPush child vẫn bị trigger
3. **trackBy bắt buộc với @for**: Không có trackBy → DOM recreated toàn bộ khi array thay đổi

**Signal bindings (Angular 17+):**
Signal trong template (\`{{ count() }}\`) KHÔNG cần dirty checking. Angular biết chính xác signal nào changed → chỉ update binding đó. Đây là lý do signals giúp performance tốt hơn.`,
          code: {
            language: 'typescript',
            filename: 'binding-performance.ts',
            code: `// ❌ Function call: chạy MỖI CD cycle
{{ getFullName() }}  // 5-10x per click!

// ✅ Signal computed: chỉ update khi dependency thay đổi
fullName = computed(() => \`\${this.firstName()} \${this.lastName()}\`);
{{ fullName() }}

// ❌ Object literal: tạo reference MỚI mỗi CD
<app-child [config]="{ theme: 'dark' }">  // OnPush vẫn trigger!

// ✅ Stable reference
config = { theme: 'dark' };
<app-child [config]="config">

// ✅ trackBy với @for
@for (item of items; track item.id) { ... }  // track by unique ID
@for (item of items; track $index) { ... }   // ❌ poor tracking`
          },
          tips: [
            'computed() signal là replacement tốt nhất cho function calls trong template - reactive + memoized',
            '@for BẮT BUỘC có track expression - dùng unique ID (item.id), TRÁNH $index (gây re-render toàn bộ)',
            'NgZone.runOutsideAngular() cho heavy computations (animation, WebSocket, requestAnimationFrame)',
            'OnPush + Signal = best performance: Angular chỉ check component khi signal dependencies thay đổi'
          ]
        },
        {
          title: 'View Queries Deep Dive',
          content: `**View Queries - truy cập DOM và child components**

**2 loại queries hoàn toàn khác nhau:**
| Query | Truy cập gì | Available khi nào | Use case |
|-------|-------------|-------------------|----------|
| ViewChild/ViewChildren | Elements trong template CỦA component | ngAfterViewInit | DOM manipulation, child component API |
| ContentChild/ContentChildren | Content được PROJECTED từ parent | ngAfterContentInit | Container components (tabs, accordion) |

**static option - timing quan trọng:**
- \`{ static: true }\`: Resolve trong ngOnInit - element PHẢI luôn tồn tại (không trong @if/@for)
- \`{ static: false }\` (default): Resolve trong ngAfterViewInit - an toàn với conditional elements

**read option - đọc type khác:**
- \`@ViewChild(MyComp)\` → trả về component instance
- \`@ViewChild(MyComp, { read: ElementRef })\` → trả về ElementRef (DOM element)
- \`@ViewChild('tpl', { read: TemplateRef })\` → trả về TemplateRef
- \`@ViewChild('item', { read: ViewContainerRef })\` → để dynamic component creation

**Signal Queries (Angular 17.2+):**
\`viewChild()\`, \`viewChildren()\`, \`contentChild()\`, \`contentChildren()\` - signal-based alternatives, reactive và type-safe hơn decorators.`,
          code: {
            language: 'typescript',
            filename: 'view-queries.ts',
            code: `// Decorator-based queries
@ViewChild('input', { static: true }) input!: ElementRef;   // available ngOnInit
@ViewChild(ChildComp) child!: ChildComp;                    // available ngAfterViewInit
@ViewChild('item', { read: ElementRef }) el!: ElementRef;   // read as ElementRef
@ViewChildren(ItemComp) items!: QueryList<ItemComp>;        // all matches

@ContentChild(TemplateRef) tpl!: TemplateRef<unknown>;      // projected template
@ContentChildren(TabComp) tabs!: QueryList<TabComp>;        // projected components

// Signal-based queries (Angular 17.2+) - recommended
input = viewChild.required<ElementRef>('input');             // required signal query
child = viewChild(ChildComp);                                // optional signal query
items = viewChildren(ItemComp);                              // signal QueryList
tabs = contentChildren(TabComp);                             // projected signal query`
          },
          tips: [
            'Signal queries (viewChild, contentChildren) là API mới - reactive, type-safe, tự động track changes',
            'QueryList.changes là Observable - subscribe để react khi @for/dynamic content thay đổi',
            'read option rất mạnh: cùng 1 element có thể đọc như ElementRef, ViewContainerRef, hoặc TemplateRef',
            'ContentChildren { descendants: false } chỉ query direct children - hữu ích cho nested container components'
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
          content: `**Component Internals - Angular tạo gì khi render component?**

Mỗi component Angular thực chất là 3 thành phần:
1. **ComponentRef**: Handle để tương tác programmatically (setInput, destroy, changeDetectorRef)
2. **LView (Logical View)**: Array chứa binding values, DOM references, child views. Đây là core data structure của Ivy CD
3. **ElementInjector**: DI container gắn với component - resolve dependencies theo element tree

**Component metadata quan trọng:**
- \`standalone: true\` (default 17+): Component tự quản imports, không cần NgModule
- \`changeDetection\`: Default hoặc OnPush - ảnh hưởng lớn đến performance
- \`host\`: Bind properties/events lên chính host element (thay thế @HostBinding/@HostListener)
- \`encapsulation\`: Cách CSS được scope (Emulated, ShadowDom, None)

**Dynamic Component Creation:**
\`ViewContainerRef.createComponent()\` tạo component programmatically. Angular 14+ có \`setInput()\` method trên ComponentRef - trigger CD correctly (khác với direct property assignment).

**Selector best practices:**
Dùng prefix (app-, feature-) để tránh conflict. Selectors có thể là element (\`app-button\`), attribute (\`[appHighlight]\`), hoặc class (\`.app-modal\` - không recommended).`,
          code: {
            language: 'typescript',
            filename: 'component-internals.ts',
            code: `@Component({
  selector: 'app-button',
  standalone: true,
  host: {
    'class': 'btn',                         // Static class luôn có
    '[class.active]': 'isActive()',          // Signal binding
    '[attr.aria-disabled]': 'disabled()',    // Accessibility
    '[attr.tabindex]': 'disabled() ? -1 : 0',
    '(click)': 'handleClick($event)',       // Host listener
  },
  template: \`<ng-content></ng-content>\`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  isActive = input(false);
  disabled = input(false);
  clicked = output<MouseEvent>();

  handleClick(e: MouseEvent) {
    if (!this.disabled()) this.clicked.emit(e);
  }
}`
          },
          tips: [
            'host object thay thế @HostBinding/@HostListener - declarative, dễ đọc, AOT-friendly',
            'OnPush + Signal inputs = maximum performance: CD chỉ chạy khi signal thay đổi',
            'ComponentRef.setInput() trigger CD properly - trực tiếp gán property thì KHÔNG trigger',
            'Prefer standalone: true + imports array thay vì NgModule declarations - tree-shaking tốt hơn'
          ]
        },
        {
          title: 'Input/Output Evolution',
          content: `**Input/Output Evolution - từ Decorators đến Signals**

**Tại sao cần Signal-based inputs?** Decorator @Input() có 3 vấn đề:
1. **Không reactive**: Phải dùng ngOnChanges hoặc setter để detect changes
2. **Mutable by default**: Child có thể vô tình modify input value
3. **Không lazy**: Không thể derive computed values trực tiếp từ inputs

**Signal inputs (Angular 17.1+) giải quyết tất cả:**
- \`input()\` → ReadonlySignal, tự động track, derive computed
- \`input.required()\` → compile-time check parent phải truyền
- \`input(default, { transform })\` → coerce values (string → boolean, etc.)

**Signal outputs (Angular 17.3+):**
- \`output()\` → thay EventEmitter, không cần RxJS
- \`outputFromObservable()\` → bridge Observable → output

**Model inputs (Angular 17.2+):**
- \`model()\` = input + output combined → two-way binding
- \`model.required()\` → bắt buộc two-way binding
- Parent dùng \`[(prop)]="signal"\` banana-in-a-box syntax

**Migration path:** @Input → input(), @Output → output(), @Input + @Output → model(). Có thể migrate gradually, cả 2 styles hoạt động song song.`,
          code: {
            language: 'typescript',
            filename: 'input-output-modern.ts',
            code: `// Signal inputs (Angular 17.1+)
name = input<string>();                    // optional, type string | undefined
id = input.required<number>();             // required, compile-time check
disabled = input(false, { transform: booleanAttribute });  // default + transform

// Derived computed - thay thế ngOnChanges!
displayName = computed(() => \`#\${this.id()}: \${this.name() ?? 'N/A'}\`);

// Signal outputs (Angular 17.3+)
saved = output<User>();                    // thay @Output() + EventEmitter
this.saved.emit(user);                     // emit event

// Model inputs - two-way binding (Angular 17.2+)
checked = model(false);                    // tạo [checked] + (checkedChange)
this.checked.update(v => !v);              // auto-emit to parent
// Parent: <app-toggle [(checked)]="isEnabled" />`
          },
          tips: [
            'Signal inputs là readonly - child KHÔNG thể modify, giải quyết accidental mutation bug',
            'computed() từ input signals thay thế hoàn toàn ngOnChanges - reactive, cleaner, no lifecycle hook',
            'model() thay thế pattern @Input() value + @Output() valueChange - 1 line thay vì 2',
            'booleanAttribute và numberAttribute là built-in transforms (Angular 17.2+) cho HTML attribute coercion'
          ]
        },
        {
          title: 'Content Projection Deep Dive',
          content: `**Content Projection - Static vs Dynamic rendering**

**Insight quan trọng nhất:** ng-content và ng-template fundamentally khác nhau:

**ng-content (Static Projection):**
- Content được **render ở PARENT** component, chỉ "di chuyển" DOM nodes vào child
- LUÔN render dù child hide nó bằng @if - vì đã render rồi mới project
- Không thể render lại hoặc delay rendering
- Use case: Simple slots (header, footer, body)

**ng-template (Dynamic/Lazy Rendering):**
- Content **KHÔNG render** cho đến khi explicitly instantiate qua ngTemplateOutlet hoặc ViewContainerRef
- Có thể render nhiều lần, ở nhiều nơi, với different contexts
- Hỗ trợ **template context**: pass data từ child → projected template
- Use case: Customizable list items, lazy panels, conditional rendering

**Multi-slot Projection:**
Dùng \`select\` attribute trên ng-content: \`<ng-content select="[header]">\`, \`<ng-content select=".footer">\`, \`<ng-content>\` (default slot).

**ngTemplateOutlet Context:**
- \`$implicit\`: Giá trị mặc định, access bằng \`let-varName\`
- Named properties: Access bằng \`let-varName="propertyName"\``,
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
          content: `**ViewChild & ViewChildren - truy cập view elements**

Cho phép component class truy cập elements, components, directives trong template.

**ViewChild - lấy 1 element:**
- Selector: template ref (\`#name\`), component type, directive type, provider token
- \`{ static: true }\`: Available ngOnInit - element PHẢI luôn tồn tại (không trong @if/@for)
- \`{ static: false }\` (default): Available ngAfterViewInit - an toàn với conditional elements
- \`{ read: Type }\`: Đọc element dưới dạng khác (ElementRef, TemplateRef, ViewContainerRef)

**ViewChildren - lấy tất cả matching elements:**
- Trả về \`QueryList<T>\` - iterable, có \`.changes\` Observable
- QueryList tự động update khi DOM thay đổi (@for add/remove items)
- Dùng \`.toArray()\`, \`.first\`, \`.last\`, \`.forEach()\` để access

**Signal Queries (17.2+):** \`viewChild()\`, \`viewChildren()\` - reactive alternatives, recommended cho new code.

**Anti-pattern:** Tránh dùng ViewChild để communicate giữa components - prefer @Input/@Output hoặc service.`,
          code: {
            language: 'typescript',
            filename: 'view-child.component.ts',
            code: `// Decorator-based
@ViewChild('searchInput') input!: ElementRef<HTMLInputElement>;
@ViewChild('searchInput', { static: true }) inputEarly!: ElementRef;  // ngOnInit
@ViewChild(ChildComponent) child!: ChildComponent;
@ViewChild('myComp', { read: ElementRef }) childEl!: ElementRef;
@ViewChildren(ItemComponent) items!: QueryList<ItemComponent>;

ngAfterViewInit() {
  this.input.nativeElement.focus();  // DOM access
  this.items.changes.subscribe(list => console.log(list.length));
}

// Signal-based (Angular 17.2+) - recommended
input = viewChild.required<ElementRef>('searchInput');
items = viewChildren(ItemComponent);
// Reactive: effect(() => console.log(this.items().length));`
          },
          tips: [
            'ViewChild undefined trong constructor và ngOnInit (trừ static: true)',
            'ViewChildren.changes là Observable - subscribe để react khi list thay đổi',
            'Prefer component interaction qua @Input/@Output hơn là ViewChild'
          ]
        },
        {
          title: 'ContentChild & ContentChildren',
          content: `**ContentChild & ContentChildren - query projected content**

Query nội dung được **projected** vào component (giữa thẻ mở và đóng).

**Phân biệt rõ:**
| | ViewChild | ContentChild |
|--|-----------|-------------|
| Query gì | Elements trong template CỦA component | Elements được project TỪ parent |
| Available | ngAfterViewInit | ngAfterContentInit |
| Ví dụ | \`<input>\` trong template | \`<app-tab>\` giữa \`<app-tabs>...</app-tabs>\` |

**Use cases thực tế:**
- **Tab Container**: ContentChildren(TabComponent) để biết có bao nhiêu tabs
- **Accordion**: ContentChildren(AccordionItem) để manage expand/collapse
- **Data Table**: ContentChild('headerTpl'), ContentChild('rowTpl') cho customizable templates
- **Card**: ContentChild('[cardHeader]'), ContentChild('[cardFooter]') cho named slots

**descendants option:**
- \`{ descendants: true }\` (default): Query tất cả nested levels
- \`{ descendants: false }\`: Chỉ query direct children - hữu ích khi có nested containers`,
          code: {
            language: 'typescript',
            filename: 'content-child.component.ts',
            code: `// Container component query projected children
@ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
@ContentChild('headerTpl') headerTpl?: TemplateRef<unknown>;

ngAfterContentInit() {
  console.log('Tabs:', this.tabs.length);
  this.tabs.changes.subscribe(() => this.updateTabs());
}

// Usage from parent:
// <app-tabs>
//   <app-tab title="Tab 1">Content 1</app-tab>
//   <app-tab title="Tab 2">Content 2</app-tab>
//   <ng-template #headerTpl let-tab>{{ tab.title }}</ng-template>
// </app-tabs>

// Signal-based (Angular 17.2+)
tabs = contentChildren(TabComponent);
headerTpl = contentChild<TemplateRef<unknown>>('headerTpl');`
          },
          tips: [
            'ContentChild/ContentChildren available trong ngAfterContentInit',
            'Dùng { descendants: true } để query nested content',
            'Có thể query TemplateRef để sử dụng với ngTemplateOutlet'
          ]
        },
        {
          title: 'View Encapsulation',
          content: `**View Encapsulation - CSS Scoping strategies**

Angular scope CSS của mỗi component để tránh conflicts. 3 chế độ:

**1. Emulated (Default) - Recommended:**
Angular thêm unique attribute (\`_ngcontent-abc\`) vào elements và rewrite CSS selectors. VD: \`.btn\` → \`.btn[_ngcontent-abc]\`. CSS được scope mà không cần Shadow DOM.

**2. ShadowDom - Native isolation:**
Dùng browser Shadow DOM API. CSS hoàn toàn isolated, global styles KHÔNG thể penetrate. \`<slot>\` thay \`<ng-content>\`. Hạn chế: một số CSS frameworks không support.

**3. None - Global styles:**
CSS trở thành global, ảnh hưởng TOÀN BỘ app. Useful cho global theming, typography. **Cẩn thận:** dễ gây style conflicts.

**Special CSS selectors:**
| Selector | Chức năng | Ví dụ |
|----------|-----------|-------|
| \`:host\` | Style host element | \`:host { display: block; }\` |
| \`:host(.active)\` | Conditional host style | \`:host(.disabled) { opacity: 0.5; }\` |
| \`:host-context(.theme-dark)\` | Style theo ancestor | Theme-aware components |
| \`::ng-deep\` | Pierce encapsulation | **DEPRECATED** - dùng CSS custom properties thay |

**Best practice:** Dùng CSS Custom Properties (\`--my-color\`) thay \`::ng-deep\` cho theming. Custom properties tự nhiên penetrate Shadow DOM.`,
          code: {
            language: 'typescript',
            filename: 'encapsulation.component.ts',
            code: `// Emulated (default): Angular thêm attribute selector
// Input:  .title { color: blue; }
// Output: .title[_ngcontent-abc] { color: blue; }

// Special selectors
:host { display: block; padding: 16px; }
:host(.active) { border: 2px solid blue; }
:host-context(.dark-theme) { background: #333; color: white; }

// ❌ ::ng-deep (DEPRECATED)
:host ::ng-deep .child { color: red; }

// ✅ CSS Custom Properties (recommended thay ::ng-deep)
// Parent: --card-bg: white;
// Child:  background: var(--card-bg, #f5f5f5);`
          },
          tips: [
            '::ng-deep deprecated nhưng chưa có replacement chính thức - dùng CSS Custom Properties là best practice',
            'ViewEncapsulation.None cho shared components (buttons, inputs) mà cần customizable styles',
            ':host-context(.theme) cho phép component tự adapt theo parent theme mà không cần @Input',
            'ShadowDom encapsulation ngăn global styles (Bootstrap, Tailwind) penetrate - cân nhắc trước khi dùng'
          ]
        },
        {
          title: 'Component Lifecycle Complete',
          content: `**Component Lifecycle - khi nào dùng hook nào**

**9 hooks theo thứ tự thực thi:**

| # | Hook | Khi nào | Use case |
|---|------|---------|----------|
| 1 | constructor | Instantiation | Chỉ DI, KHÔNG access inputs |
| 2 | ngOnChanges | @Input thay đổi | React to input changes (có SimpleChanges) |
| 3 | ngOnInit | Sau constructor + first ngOnChanges | **Setup logic**, fetch data, subscriptions |
| 4 | ngDoCheck | Mỗi CD cycle | Custom dirty checking (HIẾM dùng, perf cost) |
| 5 | ngAfterContentInit | Content projected xong | Access ContentChild/ContentChildren |
| 6 | ngAfterContentChecked | Sau mỗi content check | Update logic dựa trên projected content |
| 7 | ngAfterViewInit | View + children ready | Access ViewChild/ViewChildren, DOM manipulation |
| 8 | ngAfterViewChecked | Sau mỗi view check | **TRÁNH modify state** - gây ExpressionChangedAfterChecked |
| 9 | ngOnDestroy | Trước destroy | **PHẢI cleanup**: subscriptions, timers, event listeners |

**DestroyRef (Angular 16+) - modern alternative:**
Thay vì implement ngOnDestroy + Subject pattern, inject DestroyRef và dùng \`takeUntilDestroyed()\` - cleaner, functional style.

**Signal components (future):** Với signal inputs, nhiều lifecycle hooks trở nên unnecessary - \`computed()\` thay ngOnChanges, \`effect()\` thay ngOnInit + ngOnDestroy.`,
          code: {
            language: 'typescript',
            filename: 'lifecycle-complete.component.ts',
            code: `// OLD pattern: Subject + takeUntil
private destroy$ = new Subject<void>();
ngOnInit() {
  this.http.get('/api').pipe(takeUntil(this.destroy$)).subscribe();
}
ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }

// MODERN pattern: DestroyRef (Angular 16+)
private destroyRef = inject(DestroyRef);
ngOnInit() {
  this.http.get('/api')
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe();
}
// No ngOnDestroy needed! Auto-cleanup`
          },
          tips: [
            'DestroyRef + takeUntilDestroyed() (Angular 16+) thay thế Subject pattern - ít boilerplate, inject được',
            'Signal computed() + effect() đang dần thay thế ngOnChanges + ngOnInit - reactive by design',
            'TRÁNH modify state trong ngAfterViewChecked - gây ExpressionChangedAfterItHasBeenCheckedError',
            'ngDoCheck chạy MỖI CD cycle kể cả khi component không có thay đổi - chỉ dùng cho manual diffing thực sự cần'
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
          content: `**Signal - reactive primitive thay đổi cách Angular nghĩ về state**

Signal được giới thiệu từ Angular 16, đây không chỉ là "wrapper quanh value" mà là **nền tảng của Angular's future reactivity model**.

**Tại sao Angular cần Signals (không chỉ RxJS)?**
- RxJS quá powerful cho UI state đơn giản (subscribe/unsubscribe overhead)
- Zone.js monkey-patching gây performance cost (mọi async operation trigger CD)
- Angular cần **fine-grained reactivity** để biết CHÍNH XÁC component nào cần re-render

**3 primitives:**
| Primitive | Writable? | Lazy? | Use case |
|-----------|-----------|-------|----------|
| \`signal()\` | ✔ | - | Mutable state |
| \`computed()\` | ✘ (readonly) | ✔ (chỉ tính khi đọc) | Derived state |
| \`effect()\` | - | ✘ (eager schedule) | Side effects (logging, sync) |

**Key insight:** Signal = synchronous + always has value + auto-tracking. Observable = async + may not have value + manual subscribe.`,
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
            'signal() là synchronous - count() trả về giá trị NGAY, không cần subscribe',
            'computed() là LAZY - chỉ re-calculate khi được đọc và dependencies thay đổi',
            'effect() chạy trong microtask - KHAI BÁO trong constructor/field initializer, KHÔNG trong ngOnInit',
            'Angular 19+: linkedSignal() cho derived writable state, resource() cho async data loading'
          ]
        },
        {
          title: 'Reactive Graph Architecture (Deep Dive)',
          content: `**Reactive Graph - bản chất của Signal system**

Signal tạo thành **Directed Acyclic Graph (DAG)** - mỗi signal là node, edges là dependencies.

**3 vai trò trong graph:**
| Role | Ví dụ | Nhiệm vụ |
|------|---------|----------|
| **Producer** | signal(), computed() | Notify consumers khi thay đổi |
| **Consumer** | computed(), effect(), template | React to changes |
| **Both** | computed() | Vừa là consumer (của dependencies) vừa là producer (cho dependents) |

**Push-Pull Hybrid Model (KEY concept):**
1. **Push phase**: signal.set() → mark ALL consumers as DIRTY (chỉ đánh dấu, KHÔNG tính toán)
2. **Pull phase**: Khi consumer được đọc (ví dụ template render) → re-compute NẾU dirty

**Tại sao Push-Pull hiệu quả?**
- Không tính toán thừa (lazy) - computed không ai đọc = không tính
- Không bỏ sót (push ensures dirty flag) - đọc là có giá trị mới nhất

**Glitch-free Guarantee:**
Đảm bảo computed values luôn consistent - không bao giờ đọc được intermediate state. Angular dùng **topological sort** để đảm bảo thứ tự evaluation đúng.`,
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
            'computed() là LAZY: nếu không ai đọc, không bao giờ re-calculate dù dependencies thay đổi',
            'Auto-tracking: đọc signal() trong computed/effect = tự động đăng ký dependency, KHÔNG cần declare',
            'untracked(() => sig()) đọc giá trị mà KHÔNG tạo dependency - dùng khi cần "peek" value',
            'Version number trong signal tăng mỗi lần set() - consumer so sánh version để biết có cần re-compute không'
          ]
        },
        {
          title: 'Effect Scheduling & Cleanup',
          content: `**Effect - side effects trong Signal world**

Effect là cách duy nhất để "do something" khi signals thay đổi (logging, API call, DOM manipulation).

**QUAN TRỌNG - Effect scheduling:**
- Effect được **batch** và chạy trong **microtask** (sau current synchronous code)
- Nhiều signal.set() liên tiếp = effect chỉ chạy MỘT LẦN với giá trị cuối

**Effect lifecycle:**
1. **Create** (constructor/field) → Schedule first run
2. **Run** → Execute callback, auto-track dependencies
3. **Signal changes** → Mark dirty, re-schedule (KHAI BÁO không chạy ngay)
4. **Re-run** → Cleanup function chạy TRƯỚC, rồi execute callback
5. **Destroy** → Cleanup + remove từ graph (auto khi component destroy)

**Khi nào DÙNG effect:**
- Sync state ra ngoài Angular (localStorage, analytics, DOM API)
- Logging, debugging
- Integration với non-Angular libraries

**Khi nào KHÔNG dùng effect:**
- Derived state → dùng computed()
- HTTP calls → dùng resource() hoặc service methods
- State mutation → cẩn thận infinite loops!`,
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
            'Effect được BATCH: set() 3 lần liên tiếp = effect chỉ chạy 1 lần với giá trị cuối cùng',
            'onCleanup() BẮT BUỘC chạy trước mỗi re-run - dùng cho unsubscribe, clearTimeout, abort controller',
            'allowSignalWrites: true cho phép set() signal trong effect - NHƯNG cực kỳ dễ tạo infinite loop',
            'effect() chỉ chạy trong injection context (constructor, field initializer) - KHÔNG trong ngOnInit'
          ]
        },
        {
          title: 'Signal vs Observable Trade-offs',
          content: `**Signal vs Observable - hai model khác nhau CƠ BẢN**

| Aspect | Signal | Observable |
|--------|--------|------------|
| Mental model | **Ô nhớ** (đọc bất cứ lúc nào) | **Dòng chảy** (subscribe để lắng nghe) |
| Current value | **Luôn có** | Không đảm bảo (trừ BehaviorSubject) |
| Evaluation | Pull (lazy, tính khi đọc) | Push (eager, emit khi có data) |
| Async | **Sync only** | Async native |
| Operators | Limited (computed, effect) | Rich (200+ RxJS operators) |
| Cancellation | N/A | Unsubscribe |
| Template | \`{{ sig() }}\` direct | \`{{ obs$ \| async }}\` pipe |

**Decision matrix thực tế:**
- **Signal**: Form state, UI toggles, counters, derived display values
- **Observable**: HTTP requests, WebSocket, debounced search, complex event chains
- **Cả hai**: toSignal() cho hiển thị, toObservable() cho complex operations

**Interop là KEY:**
- \`toSignal(obs$)\`: Biến Observable thành Signal (cần initialValue hoặc handle undefined)
- \`toObservable(sig)\`: Biến Signal thành Observable (emit mỗi khi signal thay đổi)
- Angular đang hướng tới "Signals for UI, RxJS for async" - không thay thế hoàn toàn`,
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
            'toSignal(http.get()) cần { initialValue: [] } vì signal PHẢI có giá trị ban đầu - Observable chưa emit = undefined',
            'Dùng RxJS khi cần: debounceTime, switchMap, retry, combineLatest - Signals KHÔNG có operators tương đương',
            'toObservable() emit asynchronously (microtask) - không giống signal đọc synchronous',
            'Trong template: prefer signal() vì không cần async pipe, đơn giản hơn, và Angular tự track dependencies'
          ]
        },
        {
          title: 'Signal Inputs (Angular 17.1+)',
          content: `**Signal Inputs (Angular 17.1+) - thay thế @Input() decorator**

Signal inputs là **readonly signals** được Angular tự động update khi parent truyền data mới.

**Tại sao tốt hơn @Input()?**
| | @Input() | input() |
|--|----------|---------|
| Type | Plain value | ReadonlySignal |
| Reactivity | Cần ngOnChanges | computed() trực tiếp |
| Required | @Input({ required: true }) | input.required<T>() |
| Transform | @Input({ transform: fn }) | input({ transform: fn }) |
| Default | Khai báo giá trị | input(defaultValue) |

**3 dạng input():**
- \`input<string>()\`: Optional, có thể undefined
- \`input('default')\`: Optional với default value
- \`input.required<string>()\`: Parent BẮT BUỘC truyền

**Transform function:**
\`input({ transform: booleanAttribute })\` - convert string attribute thành boolean (hữu ích cho HTML attributes)

**Alias:**
\`input({ alias: 'externalName' })\` - tên khác nhau giữa internal và external`,
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
            'Signal input là InputSignal<T> (readonly) - KHÔNG thể set() từ bên trong component',
            'Dùng computed() với signal input thay vì ngOnChanges - ví dụ: fullName = computed(() => this.firstName() + this.lastName())',
            'booleanAttribute transform: <app-toggle disabled> → disabled = true (thay vì string "disabled")',
            'input.required() gây compile error nếu parent không truyền - an toàn hơn @Input() + runtime check'
          ]
        },
        {
          title: 'Signal Outputs (Angular 17.3+)',
          content: `**Signal Outputs (Angular 17.3+) - thay thế @Output() + EventEmitter**

output() tạo OutputEmitterRef - gọn hơn, type-safe hơn EventEmitter.

**So sánh:**
| | @Output() | output() |
|--|-----------|----------|
| Import | EventEmitter, Output | output (1 import) |
| Type | EventEmitter<T> | OutputEmitterRef<T> |
| Emit | this.event.emit(value) | this.event.emit(value) |
| RxJS bridge | Không | outputFromObservable() |
| Subscribe (parent) | (event)="handler($event)" | Giống nhau |

**outputFromObservable():**
Tự động emit khi Observable emit và auto-cleanup khi component destroy.

**output() KHÔNG phải signal** - nó là emitter, không có current value. Tên "signal output" hơi misleading.`,
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
            'output() không cần generic type nếu emit không có payload: save = output()',
            'outputFromObservable() tự động subscribe và unsubscribe - perfect cho bridge RxJS → parent component',
            '@Output() vẫn hoạt động tốt - output() là optional, không bắt buộc migrate',
            'outputẠlias: output({ alias: "externalName" }) - đổi tên event được parent nhìn thấy'
          ]
        },
        {
          title: 'Model Inputs (Angular 17.2+)',
          content: `**Model Inputs (Angular 17.2+) - two-way binding với Signals**

model() = input() + output() kết hợp. Tạo **WritableSignal** mà cả parent và child đều có thể thay đổi.

**Cơ chế hoạt động:**
- \`model('default')\` tạo: \`[value]\` input + \`(valueChange)\` output
- Child gọi \`model.set(newValue)\` → tự động emit (valueChange) lên parent
- Parent dùng \`[(value)]="parentSignal"\` (banana-in-a-box syntax)

**So sánh với cách cũ:**
| | Cũ (@Input + @Output) | Mới (model()) |
|--|----------------------|---------------|
| Khai báo | 2 properties | 1 property |
| Type | Value + EventEmitter | WritableSignal |
| Sync | Manual emit | Tự động |
| Reactivity | ngOnChanges | computed() |

**Use cases chính:** Custom form controls, toggles, accordion expand state, dialog open/close, tab selection`,
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
            'model() là WritableSignal - child có thể set() và update(), tự động sync lên parent',
            'Naming convention: model("value") → [(value)] từ parent. model() không tên → [(model)]',
            'model.required<T>() - parent BẮT BUỘC truyền two-way binding',
            'Perfect cho custom form controls: model<string>() thay thế ControlValueAccessor cho cases đơn giản'
          ]
        },
        {
          title: 'Advanced Signal Patterns',
          content: `**Advanced Signal Patterns - cho real-world applications**

**Pattern 1: Signal Store (state management)**
Private writable signals + public readonly + computed derived state. Thay thế BehaviorSubject pattern.

**Pattern 2: resource() (Angular 19 experimental)**
Async data loading với signals - thay thế manual HTTP subscribe:
- Tự động fetch khi dependencies thay đổi
- Built-in loading/error states
- Abortable (cancel request cũ khi dependencies thay đổi)

**Pattern 3: linkedSignal() (Angular 19)**
Writable signal mà GIÁ TRỊ được reset khi source thay đổi:
- Ví dụ: selected tab reset về 0 khi tabs list thay đổi
- Khác computed(): linkedSignal vẫn writable

**Pattern 4: Facade với Signals**
Service expose chỉ readonly signals + methods để modify state. Components không cần biết internal structure.`,
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
            'asReadonly() là MUST cho public API - không bao giờ expose WritableSignal ra ngoài service',
            'resource() (Angular 19): tự động cancel HTTP request cũ khi input thay đổi - như switchMap cho signals',
            'linkedSignal() (Angular 19): writable + auto-reset - ví dụ: selectedIndex reset về 0 khi list thay đổi',
            'Signal store pattern: private _state = signal(), public state = this._state.asReadonly(), methods set/update _state'
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
          content: `**Built-in Control Flow (Angular 17+) - thay thế structural directives**

**Tại sao Angular thay đổi?**
- *ngIf, *ngFor là directives → cần import, không tree-shakable
- Built-in syntax được compiler hiểu trực tiếp → optimize tốt hơn
- @for với track BẮT BUỘC → không còn quên trackBy

**So sánh performance:**
| | *ngFor | @for |
|--|--------|------|
| Reconciliation | Diffing algorithm | **Track-based** (nhanh hơn 2-10x) |
| Empty state | Phải check .length | @empty block built-in |
| Tree-shaking | Import CommonModule | **Built-in, 0 import** |

**@for track expression:**
- \`track item.id\`: Unique identifier (RECOMMENDED)
- \`track $index\`: Theo vị trí (dùng khi items không có unique id)
- Track giúp Angular biết item nào được thêm/xóa/di chuyển → minimize DOM operations

**@switch:** Type-safe hơn [ngSwitch] - compiler check exhaustiveness`,
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
            '@for BẮT BUỘC có track - compiler error nếu thiếu. Dùng item.id (không dùng $index trừ khi items không có id)',
            '@for có các biến ẩn: $index, $first, $last, $even, $odd, $count - dùng trực tiếp trong block',
            '@empty block: thay thế việc check *ngIf="items.length > 0" - clean hơn nhiều',
            'Migration: ng generate @angular/core:control-flow - tự động chuyển *ngIf/*ngFor sang @if/@for'
          ]
        },
        {
          title: '@defer - Lazy Loading',
          content: `**@defer (Angular 17+) - component-level lazy loading**

@defer cho phép lazy load BẤT KỲ phần template nào, không chỉ routes. Dependencies của deferred block được tự động code-split.

**Triggers (khi nào load):**
| Trigger | Mô tả | Use case |
|---------|---------|----------|
| \`on idle\` | Browser idle (default) | Below-fold content |
| \`on viewport\` | Element vào viewport | Infinite scroll, comments |
| \`on interaction\` | User click/focus | Tabs, expandable sections |
| \`on hover\` | Mouse hover | Tooltips, preview cards |
| \`on timer(Xms)\` | Sau X milliseconds | Ads, non-critical UI |
| \`on immediate\` | Ngay lập tức (lazy load, không đợi) | Critical below-fold |
| \`when condition\` | Khi expression = true | Feature flags, permissions |

**Prefetching:**
\`@defer (on viewport; prefetch on idle)\` - **prefetch** code khi idle, **render** khi vào viewport. Hai phases tách biệt!

**Sub-blocks:**
- \`@placeholder\`: Hiển thị trước khi trigger (có \`minimum\` time)
- \`@loading\`: Hiển thị khi đang load (có \`minimum\` và \`after\` time)
- \`@error\`: Hiển thị khi load thất bại`,
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
          content: `**3 loại Directive trong Angular - hiểu bản chất**

Directive là class với @Directive decorator, attach behavior vào DOM elements.

**1. Component Directive** = Directive có template (99% cái bạn viết)
**2. Structural Directive** = Thay đổi DOM structure (thêm/xóa elements từ template)
**3. Attribute Directive** = Thay đổi appearance/behavior của existing element

**Structural directive mechanics:**
Khi viết \`*ngIf="condition"\`, Angular chuyển thành:
\`<ng-template [ngIf]="condition"><div>...</div></ng-template>\`
Directive nhận TemplateRef + ViewContainerRef để create/destroy embedded views.

**Host directives (Angular 15+):**
Compose directives bằng cách attach directive lên component: \`hostDirectives: [CdkDrag]\`

**Directive composition API:**
Thay vì kế thừa, compose nhiều directives trên cùng element - flexible hơn, testable hơn.`,
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
          content: `**Built-in Attribute Directives - và khi nào DÙNG vs KHÔNG dùng**

**ngClass vs [class.name]:**
- \`[class.active]="isActive"\` - cho 1 class, **simple và được recommend**
- \`[ngClass]="{...}"\` - cho nhiều classes đồng thời, object/array syntax

**ngStyle vs [style.prop]:**
- \`[style.color]="textColor"\` - cho 1 property, **recommend**
- \`[style.font-size.px]="size"\` - có unit suffix tiện lợi
- \`[ngStyle]="{...}"\` - cho nhiều styles đồng thời

**Best practice:** Prefer \`[class.x]\` và \`[style.x]\` cho single bindings - đơn giản, tree-shakable. Dùng ngClass/ngStyle khi có dynamic object.

**Custom Attribute Directive:**
Tạo directive riêng cho repeated DOM behavior: tooltip, autofocus, permission-based visibility, click-outside.`,
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
          content: `**Services & DI - nền tảng của Angular architecture**

Service = class chứa logic không thuộc về UI. DI = cơ chế Angular cung cấp service instances cho components.

**inject() vs Constructor injection:**
| | Constructor | inject() (Angular 14+) |
|--|------------|------------------------|
| Syntax | constructor(private svc: MyService) | private svc = inject(MyService) |
| Nơi dùng | Class only | Bất kỳ injection context |
| Functional | Không | Functions, guards, interceptors |
| Inheritance | Phải call super() | Tự do |

**inject() là RECOMMENDED từ Angular 14+** vì:
- Dùng được trong functional guards, interceptors
- Không cần constructor boilerplate
- Tương thích với standalone components

**Injection context:** inject() CHỈ hoạt động trong: constructor, field initializer, factory function của provider, hoặc function được gọi từ các contexts trên.`,
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
            'providedIn: "root" = singleton + tree-shakable. Service không ai inject = tự động removed khỏi bundle',
            'inject() CHỈ dùng trong injection context - gọi trong setTimeout/subscribe sẽ throw error',
            'Component providers tạo instance MỚI cho MỖI component instance - hữu ích cho component-scoped state',
            'runInInjectionContext(injector, () => inject(Svc)) - trick để dùng inject() ngoài context thông thường'
          ]
        },
        {
          title: 'Injector Hierarchy (Deep Dive)',
          content: `**Injector Hierarchy - hiểu để debug DI issues**

Angular có **2 parallel injector trees** chạy song song:

**1. Element Injector Tree** (component hierarchy):
- Mỗi component có thể có injector riêng (qua \`providers\`)
- Walk UP component tree để tìm dependency

**2. Environment Injector Tree** (module/app level):
- Root: providers trong app.config.ts / AppModule
- Feature: Lazy-loaded routes tạo child environment injector
- Platform: Angular platform services

**Resolution algorithm (đây là KEY):**
1. Check Element Injector của component hiện tại
2. Walk UP Element Injector tree (parent → grandparent → root)
3. Cross sang Environment Injector tree
4. Walk UP Environment Injector (feature → root → platform)
5. Đến NullInjector → throw NullInjectorError (trừ khi @Optional())

**Điểm chú ý:** Element Injector được check TRƯỚC Environment Injector. Nếu component cung cấp service qua providers, nó sẽ override singleton từ root.`,
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
            'Element injector check TRƯỚC environment - component providers override root singleton',
            'Lazy routes tạo child EnvironmentInjector - services trong route providers không leak ra ngoài',
            '@Optional() tránh NullInjectorError - trả về null thay vì throw',
            '@Self() chỉ tìm trong element injector hiện tại, @SkipSelf() bỏ qua hiện tại đi lên parent'
          ]
        },
        {
          title: 'Provider Types & Tokens',
          content: `**Provider Types - recipe để tạo dependencies**

**4 loại provider:**
| Type | Kí hiệu | Khi nào dùng |
|------|---------|------------|
| useClass | \`{ provide: A, useClass: B }\` | Thay thế implementation (testing, platform-specific) |
| useValue | \`{ provide: TOKEN, useValue: val }\` | Constants, configs, mock objects |
| useFactory | \`{ provide: A, useFactory: fn }\` | Logic phức tạp khi tạo instance |
| useExisting | \`{ provide: A, useExisting: B }\` | Alias - 2 tokens trỏ cùng instance |

**InjectionToken - type-safe token cho non-class values:**
Khi provide string, number, interface (không có runtime representation), dùng InjectionToken<T> để type-safe.

**InjectionToken với factory (tree-shakable):**
\`new InjectionToken('CONFIG', { providedIn: 'root', factory: () => defaultConfig })\`
Tree-shakable vì factory chỉ chạy nếu ai inject token này.

**Multi providers:**
\`{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }\`
Nhiều providers cho cùng token - inject ra array. Dùng cho plugin systems, interceptors.`,
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
            'useFactory: deps array phải match thứ tự parameters của factory function - sai thứ tự = wrong dependency',
            'multi: true KHÔNG ghi đè mà THÊM vào array - inject sẽ nhận được array tất cả providers',
            'InjectionToken với factory + providedIn:"root" là cách đúng để provide config - tree-shakable và có default value',
            'useExisting tạo alias không phải instance mới - cả hai tokens trỏ cùng object trong memory'
          ]
        },
        {
          title: 'forRoot/forChild Pattern',
          content: `**forRoot/forChild - giải quyết multiple instances problem**

**Vấn đề:** Module A import LibModule (có providers). Module B cũng import LibModule. Kết quả: 2 instances của service!

**Giải pháp forRoot/forChild:**
- \`LibModule.forRoot()\` → return module + providers (import 1 lần ở root)
- \`LibModule.forChild()\` → return module only (import ở feature modules)

**Khi nào cần pattern này?**
- Libraries cần singleton service + cấu hình (RouterModule, StoreModule, TranslateModule)
- Internal modules có shared services

**Modern alternatives (Angular 14+):**
- \`providedIn: 'root'\` → singleton tự động, tree-shakable, KHÔNG cần forRoot
- \`provideRouter(routes)\` thay RouterModule.forRoot(routes)
- \`provideHttpClient()\` thay HttpClientModule
- \`ENVIRONMENT_INITIALIZER\` token cho setup logic khi module load

**Kết luận:** Code mới không cần forRoot/forChild. Nhưng cần hiểu vì nhiều libraries vẫn dùng.`,
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
            'providedIn: "root" thay thế forRoot - singleton tự động, tree-shakable, không cần module',
            'Lazy routes tự động tạo child EnvironmentInjector - providers trong route scoped cho subtree đó',
            'provideRouter/provideHttpClient/provideAnimations - standalone equivalents của Module.forRoot()',
            'ENVIRONMENT_INITIALIZER token: chạy setup code khi injector được tạo - thay thế APP_INITIALIZER cho feature modules'
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
          content: `**Lifecycle Hooks - khi nào Angular gọi gì và TẠI SAO**

Mỗi component/directive có lifecycle được Angular quản lý. Hooks cho phép bạn "hook into" các thời điểm quan trọng.

**Tại sao cần nhiều hooks?**
- **Timing matters**: ViewChild chưa available trong ngOnInit
- **Performance**: ngDoCheck chạy MỖI CD cycle - sai chỗ = chậm
- **Memory**: ngOnDestroy là cơ hội DUY NHẤT để cleanup

**afterRender / afterNextRender (Angular 17+):**
Hooks mới thay thế ngAfterViewInit cho DOM manipulation:
- \`afterRender()\`: Chạy SAU MỖI render cycle (như ngAfterViewChecked nhưng modern)
- \`afterNextRender()\`: Chạy SAU render TIẾP THEO (1 lần, như ngAfterViewInit)
- Chỉ chạy trên BROWSER (không chạy trong SSR) - an toàn cho DOM APIs

**DestroyRef (Angular 16+):**
Inject DestroyRef để register cleanup callbacks - thay thế ngOnDestroy + Subject pattern. Dùng với takeUntilDestroyed() cho RxJS.`,
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
          content: `**Thứ tự Lifecycle Hooks - bảng tổng hợp chi tiết**

| # | Hook | Số lần gọi | Khi nào | Dùng cho |
|---|------|-----------|---------|----------|
| 1 | constructor | 1 | Instance tạo | CHỈ DI, không logic |
| 2 | ngOnChanges | N | @Input thay đổi | React to input changes (SimpleChanges) |
| 3 | ngOnInit | 1 | Sau constructor + first ngOnChanges | **Setup logic**, fetch data |
| 4 | ngDoCheck | N | Mỗi CD cycle | Custom dirty checking (HIẾM dùng!) |
| 5 | ngAfterContentInit | 1 | Projected content ready | Access ContentChild |
| 6 | ngAfterContentChecked | N | Sau mỗi content check | React to projected content changes |
| 7 | ngAfterViewInit | 1 | View + children ready | Access ViewChild, DOM |
| 8 | ngAfterViewChecked | N | Sau mỗi view check | **TRÁNH modify state!** |
| 9 | ngOnDestroy | 1 | Trước destroy | **CLEANUP: unsub, timers, listeners** |

**Signal components (tương lai):** Nhiều hooks sẽ không cần nữa:
- ngOnChanges → computed() tự react khi input signal thay đổi
- ngOnInit setup → effect() cho side effects
- ngOnDestroy → DestroyRef + takeUntilDestroyed() auto-cleanup`,
          tips: [
            'ngOnInit là nơi fetch data vì inputs đã có giá trị (khác constructor - inputs chưa set)',
            'ngOnDestroy: dùng DestroyRef + takeUntilDestroyed() thay Subject pattern - ít boilerplate hơn nhiều',
            'ngAfterViewChecked: TRAÝNH modify state ở đây - gây ExpressionChangedAfterItHasBeenCheckedError',
            'afterNextRender() (Angular 17+): thay ngAfterViewInit cho DOM manipulation - chỉ chạy trên browser, an toàn cho SSR'
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
          content: `**RxJS - cột sống của Angular async operations**

RxJS vẫn là core của Angular cho HTTP, Router, Forms, và complex async flows. Signals không thay thế RxJS.

**Mental model: Observable = function that returns multiple values over time**
- Observable là LAZY - không làm gì cho đến khi subscribe
- Mỗi subscribe = một execution độc lập (cold observable)
- Contract: next*(error|complete)? - sau error/complete không emit nữa

**Observable vs Promise vs Signal:**
| | Observable | Promise | Signal |
|--|-----------|---------|--------|
| Values | Nhiều | 1 | 1 (current) |
| Lazy | ✔ | ✘ (eager) | - |
| Cancel | ✔ (unsubscribe) | ✘ | - |
| Async | ✔ | ✔ | ✘ (sync) |
| Operators | 200+ | .then/.catch | computed |
| Angular dùng cho | HTTP, events | Ít dùng | UI state |

**Cold vs Hot:**
- **Cold**: Mỗi subscriber tạo execution mới (HTTP calls) - như xem video từ đầu
- **Hot**: Shared execution, late subscribers miss values (WebSocket, DOM events) - như xem live stream`,
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
            'HTTP Observable tự complete sau response - KHÔNG cần unsubscribe. Nhưng interval$, Subject CẦN unsubscribe',
            'async pipe là best practice cho template - tự subscribe/unsubscribe, trigger OnPush CD',
            'Cold observable: mỗi subscribe = một HTTP request mới! Dùng shareReplay(1) để cache',
            'Angular đang hướng tới: Signals cho UI state, RxJS cho async operations - học cả hai'
          ]
        },
        {
          title: 'Observable Contract (Deep Dive)',
          content: `**Observable Contract - hiểu để không bị bug**

Observable = **function được gọi khi subscribe**, trả về teardown logic.

**Contract chặt chẽ:** \`next*(error|complete)?\`
- Gọi next() 0 hoặc nhiều lần
- Kết thúc bằng error() HOẶC complete() (không cả hai)
- Sau error/complete: KHÔNG next() nữa (stream chết)

**Tại sao quan trọng?**
- catchError trong pipe: bắt error, return recovery observable → outer stream sống tiếp
- catchError ngoài (trong subscribe error handler): stream đã chết, không recovery
- retry(): resubscribe (tạo execution mới) sau error

**Subscriber vs Observer:**
- Observer: object với { next, error, complete } - bạn truyền vào subscribe()
- Subscriber: internal wrapper đảm bảo contract (không next sau error/complete)`,
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
            'Cold = unicast: mỗi subscribe = execution mới. http.get() gọi 2 lần = 2 HTTP requests!',
            'Hot = multicast: shared execution. Subject, fromEvent, WebSocket - late subscribers miss past values',
            'Subject = Observable + Observer: có thể next() để push values, và subscribe() để nhận values',
            'share() / shareReplay(1) biến cold thành hot - một execution, nhiều subscribers'
          ]
        },
        {
          title: 'Higher-Order Mapping',
          content: `**Higher-Order Mapping - bản chất và decision guide**

Tất cả 4 operators: nhận outer value → tạo inner Observable → flatten kết quả.
Khác nhau ở cách XỬ LÝ khi inner Observable CHƯA XONG mà outer emit tiếp.

**Decision guide thực tế:**
| Operator | Xử lý concurrent | Use case chính |
|----------|-------------------|---------------|
| switchMap | **Cancel cũ, lấy mới** | Search autocomplete, route params |
| mergeMap | **Chạy song song** | Bulk upload, independent requests |
| concatMap | **Queue tuần tự** | Ordered mutations, sequential saves |
| exhaustMap | **Bỏ qua mới** | Form submit (chống double-click) |

**Rule of thumb:**
- Đọc data (GET) → switchMap (cancel stale)
- Ghi data (POST/PUT) → concatMap (order matters) hoặc exhaustMap (prevent duplicate)
- Independent operations → mergeMap (max parallelism)
- Login/submit → exhaustMap (ignore repeated clicks)`,
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
            'switchMap là DEFAULT tốt nhất cho hầu hết HTTP GET - cancel request cũ khi có request mới',
            'exhaustMap cho form submit - user click 5 lần, chỉ request đầu tiên được gửi, 4 lần sau bị IGNORE',
            'concatMap giữ ORDER - request 2 đợi request 1 xong mới gửi. Dùng khi server cần xử lý tuần tự',
            'mergeMap(fn, 3) - giới hạn max 3 concurrent requests. Không giới hạn = có thể overwhelm server'
          ]
        },
        {
          title: 'Error Handling & Retry',
          content: `**Error Handling - stream sống hay chết?**

Khi error xảy ra, Observable **CHẾT** (không emit nữa). Đây là lý do catchError QUAN TRỌNG.

**catchError vị trí matters:**
- Trong switchMap/mergeMap inner: **outer stream sống** - chỉ inner request fail
- Ở ngoài cùng: outer stream **cũng chết** sau error

**Recovery strategies:**
| Strategy | Operator | Khi nào |
|----------|----------|--------|
| Default value | catchError(() => of([])) | Fallback UI |
| Retry | retry(3) | Transient network errors |
| Retry với delay | retry({ count: 3, delay: 1000 }) | Rate limiting |
| Exponential backoff | retry({ delay: (err, i) => timer(2**i * 1000) }) | Production retry |
| Skip | catchError(() => EMPTY) | Non-critical operations |
| Re-throw | catchError(e => throwError(() => e)) | Let parent handle |

**finalize():** Chạy dù success hay error - như finally trong try/catch. Dùng cho loading spinners.`,
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
            'catchError trong switchMap inner: outer stream SỐNG tiếp. Ở ngoài: stream CHẾT sau error',
            'retry(3) resubscribe 3 lần - với HTTP = gửi lại request. Dùng cho transient errors',
            'retry({ delay: (_, i) => timer(Math.pow(2, i) * 1000) }) - exponential backoff cho production',
            'EMPTY vs of(null): EMPTY complete ngay (không emit), of(null) emit null rồi complete'
          ]
        },
        {
          title: 'Async Pipe & Subscription Management',
          content: `**Subscription Management - tránh memory leaks**

**Ranking các cách unsubscribe (tốt → xấu):**

| # | Cách | Khi nào dùng |
|---|------|------------|
| 1 | **async pipe** | Template binding - TỐT NHẤT |
| 2 | **takeUntilDestroyed()** | Logic trong class (Angular 16+) |
| 3 | **DestroyRef.onDestroy()** | Non-RxJS cleanup |
| 4 | **Subject + takeUntil** | Legacy code (Angular < 16) |
| 5 | **Manual unsubscribe** | Đơn lẻ, simple cases |

**Khi nào KHÔNG cần unsubscribe?**
- HTTP requests (auto-complete sau response)
- ActivatedRoute.params (Router quản lý)
- async pipe (auto-unsubscribe)

**Khi nào BẮT BUỘC unsubscribe?**
- interval(), timer() (infinite streams)
- Subject, BehaviorSubject
- fromEvent() (DOM events)
- Custom Observables không complete`,
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
          content: `**Higher-Order Mapping - ví dụ thực tế và marble diagram mental model**

**Marble diagram mental model (hình dung):**
\`switchMap\`: --a--b--c--  → chỉ result của c (a,b bị cancel)
\`mergeMap\`:  --a--b--c--  → results của a,b,c (không thứ tự)
\`concatMap\`: --a--b--c--  → results của a, rồi b, rồi c (giữ thứ tự)
\`exhaustMap\`:--a--b--c--  → chỉ result a (b,c bị ignore vì a chưa xong)

**Real-world Angular patterns:**
- **Route params → data**: switchMap (cancel stale khi navigate nhanh)
- **Search autocomplete**: switchMap + debounceTime + distinctUntilChanged
- **Form auto-save**: concatMap (save theo thứ tự user edit)
- **Login button**: exhaustMap (prevent double-submit)
- **Batch delete**: mergeMap(item => deleteApi(item), 5) - parallel với limit`,
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
            'switchMap là safe default cho GET requests - KHÔNG dùng cho POST/PUT (cancel = mất data!)',
            'mergeMap không đảm bảo order - response nào về trước thì emit trước. Dùng concatMap nếu cần order',
            'exhaustMap thường đi với finalize(() => loading = false) - khi request xong mới cho click lại',
            'Kết hợp: debounceTime(300) + distinctUntilChanged() + switchMap() = search pattern chuẩn'
          ]
        },
        {
          title: 'Combination Operators',
          content: `**Combination Operators - khi nào dùng cái nào**

| Operator | Emit khi | Kết quả | Use case |
|----------|----------|----------|----------|
| combineLatest | BẤT KỲ source emit | Array latest values | Derived state từ nhiều sources |
| forkJoin | TẤT CẢ complete | Array final values | Parallel HTTP requests |
| merge | BẤT KỲ source emit | Single value | Merge events từ nhiều sources |
| zip | TẤT CẢ emit (pair) | Array paired values | Pair request-response |
| withLatestFrom | Primary emit | [primary, ...latest] | Main stream + context |
| concat | Tuần tự (xong source 1 mới sang 2) | Single value | Ordered operations |

**Lưu ý quan trọng:**
- combineLatest CHỊ emit sau khi TẤT CẢ sources đã emit ít nhất 1 lần
- forkJoin CHỈ dùng cho finite observables (HTTP) - không dùng với interval/Subject
- withLatestFrom KHÔNG trigger khi secondary stream emit - chỉ primary
- Dùng startWith() với combineLatest để không phải đợi tất cả sources`,
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
            'combineLatest + startWith(): thêm startWith cho slow sources để không block các sources khác',
            'forkJoin với HTTP: parallel requests, nhận tất cả results cùng lúc. Một fail = tất cả fail (dùng catchError per request)',
            'combineLatest cho ViewModel: vm$ = combineLatest([users$, filter$, sort$]).pipe(map(...))',
            'merge cho event aggregation: merge(click$, touch$, keyboard$) → xử lý chung'
          ]
        },
        {
          title: 'Error Handling & Retry',
          content: `**Error Handling Patterns - cho production apps**

**Error handling strategy theo layers:**

| Layer | Cách xử lý | Ví dụ |
|-------|------------|--------|
| **Service** | catchError + default value / retry | API calls |
| **Interceptor** | Global error handling, redirect | 401 → login, 500 → error page |
| **Component** | catchError + UI feedback | Show error message |
| **ErrorHandler** | Global uncaught errors | Logging service |

**Key patterns:**
- catchError TRẢ VỀ recovery observable (of([]), EMPTY) → stream sống tiếp
- catchError + throwError() → re-throw cho layer trên xử lý
- retry + catchError: retry trước, catchError sau (order matters!)
- finalize(): luôn chạy dù success/error - dùng cho loading state`,
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
            'catchError trong inner pipe (switchMap inner): outer stream sống. Ở ngoài: cả stream chết',
            'retry(đặt TRƯỚC catchError): retry trước, hết retry mới catchError. Đảo thứ tự = retry không bao giờ chạy',
            'finalize() chạy sau complete HOẶC error - perfect cho loading spinner: tap(() => loading = true) + finalize(() => loading = false)',
            'throwError(() => new Error()) dùng factory function - không phải throwError(new Error()) (deprecated)'
          ]
        },
        {
          title: 'Subject Types',
          content: `**Subject Types - khi nào dùng loại nào**

Subject = Observable + Observer = có thể next() và subscribe().

| Type | Initial value | Late subscriber nhận | Use case |
|------|--------------|---------------------|----------|
| Subject | Không | KHÔNG (miss past) | Event bus, triggers |
| BehaviorSubject | BắT BUỘC | Latest value NGAY | **State management** (phổ biến nhất) |
| ReplaySubject(n) | Không | n values cuối | Cache history, chat messages |
| AsyncSubject | Không | Chỉ value cuối khi complete | One-time computation |

**BehaviorSubject là phổ biến nhất vì:**
- Luôn có current value (\`.value\` property)
- New subscriber nhận latest value ngay
- Perfect cho state: loading$, currentUser$, selectedFilter$

**BehaviorSubject vs Signal:**
Signals đang thay thế BehaviorSubject cho simple state. Nhưng BehaviorSubject vẫn cần khi:
- Cần pipe operators (debounce, switchMap)
- Stream cần được pass qua APIs expecting Observable
- Legacy code chuyển đổi dần`,
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
            'BehaviorSubject: expose asObservable() cho public API - ngăn components gọi next() trực tiếp',
            'BehaviorSubject vs Signal: signal() đơn giản hơn cho UI state; BehaviorSubject mạnh hơn với RxJS operators',
            'ReplaySubject(1) giống BehaviorSubject nhưng KHÔNG cần initial value - dùng khi không có default',
            'Subject.complete() = stream chết vĩnh viễn. KHÔNG thể next() sau complete(). Sai = silent fail'
          ]
        },
        {
          title: 'RxJS Best Practices',
          content: `**RxJS Best Practices - cho Senior Angular dev**

**1. Declarative over Imperative:**
Khai báo streams như data flow, KHÔNG subscribe trong subscribe.

**2. Unsubscribe strategy (priority order):**
1. async pipe (template) - auto cleanup
2. takeUntilDestroyed() (Angular 16+) - modern
3. DestroyRef.onDestroy() - non-RxJS cleanup
4. takeUntil(destroy$) - legacy but works

**3. Error isolation:**
Luôn catchError trong inner observable (switchMap, mergeMap) để giữ outer stream alive.

**4. Sharing:**
shareReplay({ bufferSize: 1, refCount: true }) - cache result, auto-cleanup khi không còn subscriber.

**5. Debug:**
tap(x => console.log('debug:', x)) - side-effect-free debugging trong pipe.`,
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
            'takeUntilDestroyed() trong constructor/field - KHÔNG dùng trong ngOnInit (ngoài injection context)',
            'async pipe: giảm n = subscriptions, tự trigger OnPush CD, tự cleanup. WIN-WIN-WIN',
            'subscribe trong subscribe = CODE SMELL. Dùng switchMap/mergeMap/concatMap thay thế',
            'shareReplay({ refCount: true }): refCount: true = auto-cleanup khi hết subscriber. false = cache vĩnh viễn'
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
          content: `**Template-driven vs Reactive Forms - chọn đúng cách**

| Tiêu chí | Template-driven | Reactive |
|----------|----------------|----------|
| Form model | Implicit (ngModel) | **Explicit** (FormGroup) |
| Logic | Trong template | **Trong class** |
| Validation | Directives (required, email) | **Functions** (Validators.required) |
| Testing | Khó (cần DOM) | **Dễ** (pure class test) |
| Dynamic | Khó | **Dễ** (FormArray, addControl) |
| Type safety | Không | **Có** (Angular 14+ Typed Forms) |
| Reactivity | ngModelChange | **valueChanges Observable** |

**Khi nào dùng Template-driven?**
Forms đơn giản: login, search, contact - ít fields, không dynamic.

**Khi nào dùng Reactive?**
Forms phức tạp: multi-step, dynamic fields, cross-field validation, form arrays.

**Best practice:** Reactive Forms cho mọi project. Template-driven chỉ cho prototype/simple.

**Tương lai: Signal Forms (Angular 21+ experimental)**
Forms dựa trên Signals thay vì RxJS - đơn giản hơn, synchronous, less boilerplate.`,
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
          content: `**Reactive Forms - building blocks và patterns**

**3 building blocks:**
| Class | Mô tả | Ví dụ |
|-------|---------|--------|
| FormControl | Một field | email, password |
| FormGroup | Group các controls | address { street, city, zip } |
| FormArray | Dynamic list | phones[], addresses[] |

**FormBuilder là shorthand:**
\`fb.group({ name: ['', Validators.required] })\` = \`new FormGroup({ name: new FormControl('', Validators.required) })\`

**NonNullableFormBuilder (Angular 14+):**
Tất cả controls có \`nonNullable: true\` - reset() trả về initial value thay vì null.

**Key reactive patterns:**
- \`valueChanges\`: Observable emit mỗi khi form value thay đổi
- \`statusChanges\`: Observable emit form status (VALID, INVALID, PENDING)
- \`patchValue()\` vs \`setValue()\`: patchValue cho phép partial update, setValue bắt buộc ALL fields`,
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
            'NonNullableFormBuilder: form.reset() trả về initial values thay vì null - ít bug hơn nhiều',
            'patchValue() cho partial update (chỉ set 1 vài fields), setValue() bắt buộc set TẤT CẢ fields',
            'valueChanges là Observable - dùng debounceTime + switchMap cho auto-save pattern',
            'getRawValue() trả về tất cả values kể cả disabled controls - dùng khi submit form'
          ]
        },
        {
          title: 'Custom Validators',
          content: `**Custom Validators - sync, async, và cross-field**

**Validator function:** Nhận AbstractControl, trả về ValidationErrors | null.
- null = VALID
- { errorKey: errorValue } = INVALID

**3 loại validators:**
| Loại | Trả về | Dùng cho |
|------|---------|----------|
| Sync | ValidationErrors \| null | Format check, range, regex |
| Async | Observable/Promise<ValidationErrors \| null> | Server validation (check email exists) |
| Cross-field | Gắn vào FormGroup | Password match, date range |

**Cross-field validator (thường bị quên):**
Gắn vào FormGroup (không phải FormControl) để access nhiều controls:
\`fb.group({ password: [''], confirm: [''] }, { validators: passwordMatchValidator })\`

**Validator factory pattern:**
Tạo function trả về ValidatorFn để có thể truyền parameters:
\`forbiddenName('admin')\` thay vì hardcode trong validator.`,
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
          content: `**Async Validators - server-side validation**

Async validators chạy SAU khi tất cả sync validators pass. Trả về Observable hoặc Promise.

**Thứ tự execution:**
1. Sync validators chạy trước
2. Nếu sync INVALID → async KHÔNG chạy (tiết kiệm API calls)
3. Nếu sync VALID → async chạy, form status = PENDING
4. Async complete → form status = VALID hoặc INVALID

**Best practices cho async validators:**
- **Debounce**: Dùng timer/debounceTime để không gọi API mỗi keystroke
- **Cancel**: switchMap để cancel request cũ khi user gõ tiếp
- **Error handling**: catchError(() => of(null)) - validation error = vấn đề server, không phải invalid input
- **Loading UI**: Check control.status === 'PENDING' để show spinner

**inject() trong async validator (Angular 14+):**
Dùng inject() trong factory function thay vì truyền service qua parameter - cleaner.`,
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
            'Async validators chỉ chạy khi sync validators PASS - tiết kiệm API calls tự động',
            'Debounce 300-500ms trong async validator - không gọi API mỗi keystroke',
            'control.status === "PENDING" → show loading spinner cạnh input field',
            'Dùng inject() trong validator factory: export const uniqueEmail = () => { const svc = inject(UserSvc); return (ctrl) => ... }'
          ]
        },
        {
          title: 'Form Error Display',
          content: `**Form Error Display - UX patterns**

**Khi nào hiển thị errors?**
- **Touched**: User đã focus rồi blur (không show ngay khi load)
- **Dirty**: User đã thay đổi value
- **Submitted**: Form đã submit (show tất cả errors)

**Pattern: isFieldInvalid()**
\`return control.invalid && (control.touched || submitted)\`

**Reusable error component:**
Tạo shared component nhận FormControl và error messages map:
\`<app-field-error [control]="form.get('email')" [messages]="{required: 'Email required', email: 'Invalid'}"/>\`

**Error messages centralized:**
Tạo service/constant chứa tất cả error messages - dễ maintain, dễ i18n.`,
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
          content: `**Typed Forms (Angular 14+) - catch bugs tại compile time**

Angular 14+ mặc định forms là typed. FormControl<string> không chấp nhận number.

**Key concepts:**
- \`FormControl<string>\`: typed, value luôn là string
- \`FormControl<string | null>\`: nullable (default khi reset)
- \`NonNullableFormBuilder\`: tất cả controls nonNullable - reset trả về initial value

**Interface cho form:**
\`interface UserForm { name: FormControl<string>; age: FormControl<number | null>; }\`
\`form = new FormGroup<UserForm>({...})\`

**getRawValue() vs value:**
- \`form.value\` bỏ qua disabled controls (partial type)
- \`form.getRawValue()\` trả về TẤT CẢ values kể cả disabled

**Migration:** Angular 14+ tự động infer types. Chỉ cần thêm generic khi muốn strict hơn.`,
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
            'NonNullableFormBuilder: form.reset() trả về initial values thay vì null - tránh NullPointerException',
            'form.value type là Partial (disabled controls bị bỏ) - dùng getRawValue() cho complete data',
            'Dịnh nghĩa interface cho form: IDE autocomplete, refactor safe, catch typos tại compile time',
            'fb.control("", { nonNullable: true }) - individual control cũng có thể set nonNullable'
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
          content: `**Angular Router - URL-driven navigation**

Router maps URLs → Components. Tất cả navigation trong SPA diễn ra trên client.

**Route resolution algorithm:**
1. URL được parse thành segments
2. Router match segments với Routes config (first-match wins!)
3. Guards được check (canActivate, canMatch, etc.)
4. Resolvers fetch data
5. Component render vào \`<router-outlet>\`

**Route config tips:**
- \`pathMatch: 'full'\` cho redirects - không dùng 'prefix' sẽ match mọi thứ
- \`**\` wildcard PHẢI đặt CUỐI (first-match wins)
- provideRouter(routes) thay RouterModule.forRoot() trong standalone apps

**Router features (standalone):**
\`provideRouter(routes, withComponentInputBinding(), withViewTransitions(), withPreloading(PreloadAllModules))\`
- withComponentInputBinding(): route params tự động bind vào @Input()
- withViewTransitions(): animate giữa routes (View Transitions API)`,
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
          content: `**Navigation & Route Params - các cách lấy data từ URL**

**3 cách navigate:**
1. Template: \`[routerLink]="['/users', id]"\` - declarative
2. Router: \`router.navigate(['/users', id])\` - imperative
3. Router: \`router.navigateByUrl('/users/123')\` - absolute URL

**Lấy route params:**
| Property | Loại | Ví dụ |
|----------|------|--------|
| params | Observable | \`/users/:id\` → route.params |
| queryParams | Observable | \`?page=1&sort=name\` |
| data | Observable | Static data từ route config |
| paramMap | Observable (Map API) | \`.get('id'), .getAll('tags')\` |

**withComponentInputBinding() (Angular 16+):**
Route params, query params, data, resolve tự động bind vào @Input():
- \`input id = input<string>()\` nhận \`:id\` từ URL
- Không cần inject ActivatedRoute + subscribe nữa!`,
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
          content: `**Lazy Loading - giảm initial bundle và load theo nhu cầu**

Lazy loading tự động code-split thành separate chunks. Browser chỉ download khi navigate.

**2 cách lazy load:**
- \`loadComponent\`: Lazy load single component
- \`loadChildren\`: Lazy load cả route subtree (feature routes)

**Preloading Strategies (prefetch trong background):**
| Strategy | Mô tả |
|----------|--------|
| NoPreloading | Default - chỉ load khi navigate |
| PreloadAllModules | Prefetch ALL lazy routes sau initial load |
| Custom | Logic riêng: prefetch routes có data.preload = true |

**Route-level providers:**
Lazy routes có child EnvironmentInjector - services trong \`providers\` scoped cho route subtree đó.

**Performance impact:**
- Main bundle giảm đáng kể (50-80% cho large apps)
- First load nhanh hơn
- Kết hợp với @defer để lazy load component-level`,
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
            'loadComponent lazy load 1 component, loadChildren lazy load cả feature routes - dùng loadChildren cho features lớn',
            'PreloadAllModules: prefetch sau initial load - tốt cho apps có \u00edt routes. Custom strategy cho apps lớn',
            'Lazy route providers được scoped - service instance tồn tại chỉ trong route subtree, destroy khi navigate away',
            'Kết hợp lazy routes + @defer: route-level chunking + component-level chunking = maximum splitting'
          ]
        },
        {
          title: 'Route Guards',
          content: `**Route Guards - functional guards (Angular 15+)**

Guards kiểm soát navigation: cho phép, redirect, hoặc block.

**Các loại guards:**
| Guard | Khi nào chạy | Use case |
|-------|------------|----------|
| canActivate | Trước khi activate route | Auth check, role check |
| canActivateChild | Trước khi activate child routes | Parent-level auth |
| canDeactivate | Trước khi rời route | Unsaved changes warning |
| canMatch | Trước khi match route | Feature flags, A/B testing |
| resolve | Sau guards, trước render | Pre-fetch data |

**Functional guards (Angular 15+) - RECOMMENDED:**
Không cần class, chỉ function với inject():
\`export const authGuard: CanActivateFn = () => inject(AuthService).isLoggedIn() || inject(Router).parseUrl('/login')\`

**canMatch (Angular 15.1+):**
Chạy TRƯỚC route matching - nếu false, router tiếp tục match routes khác. Dùng cho feature flags:
Cùng path '/dashboard' nhưng render component khác cho admin vs user.

**Guards trả về:** true | false | UrlTree (redirect) | Observable<boolean|UrlTree>`,
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
          content: `**HttpClient - cấu hình và features quan trọng**

Angular 15+ dùng provideHttpClient() (standalone) thay vì HttpClientModule.

**HttpClient features và configuration:**
| Feature function | Mục đích |
|-----------------|--------|
| withInterceptors([]) | Functional interceptors (Angular 15+) |
| withFetch() | Dùng Fetch API thay XMLHttpRequest (SSR-friendly) |
| withRequestsMadeViaParent() | Route requests qua parent injector |
| withJsonpSupport() | JSONP cross-domain requests |
| withXsrfConfiguration() | CSRF token config |

**withFetch() tại sao quan trọng?**
- Streaming responses (ReadableStream)
- Tương thích SSR tốt hơn (Node.js native fetch)
- HttpTransferCache: SSR fetch data → transfer state → client không fetch lại

**HttpClient trả về Cold Observable:**
Mỗi subscribe = một HTTP request mới! Dùng shareReplay(1) nếu cần cache.`,
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
            'provideHttpClient() tree-shakable - chỉ include features bạn dùng (interceptors, fetch, jsonp)',
            'withFetch(): Fetch API native, streaming support, SSR-friendly. Nên dùng cho projects mới',
            'HttpTransferCache (SSR): data được fetch trên server được transfer sang client - không double-fetch',
            'Mỗi subscribe vào http.get() = MỘT REQUEST MỚI! Dùng shareReplay(1) để cache kết quả'
          ]
        },
        {
          title: 'Basic HTTP Requests',
          content: `**Basic HTTP Requests - patterns chuẩn**

HttpClient trả về Cold Observable - tự complete sau response (không cần unsubscribe).

**HTTP methods và conventions:**
| Method | Mục đích | Body | Idempotent |
|--------|---------|------|------------|
| GET | Đọc data | Không | ✔ |
| POST | Tạo mới | Có | ✘ |
| PUT | Thay thế toàn bộ | Có | ✔ |
| PATCH | Update một phần | Có | ✘ |
| DELETE | Xóa | Không | ✔ |

**Tất cả methods đều generic:** \`http.get<User[]>(url)\` - TypeScript biết response type.

**HttpParams cho query strings:**
Immutable - mỗi .set()/.append() trả về instance MỚI (như HttpHeaders).`,
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
          content: `**Headers & Request Options - customize requests**

**HttpHeaders và HttpParams đều IMMUTABLE:**
\`.set()\` trả về instance mới, KHÔNG modify instance cũ. Chain calls hoặc gán lại biến.

**Response types:**
| responseType | Trả về | Dùng cho |
|-------------|---------|----------|
| 'json' (default) | parsed object | API responses |
| 'text' | string | Plain text, HTML |
| 'blob' | Blob | File download |
| 'arraybuffer' | ArrayBuffer | Binary data |

**observe option:**
- \`observe: 'body'\` (default): chỉ response body
- \`observe: 'response'\`: full HttpResponse với headers, status
- \`observe: 'events'\`: HttpEvent stream (upload progress)

**reportProgress: true** + observe: 'events' cho upload/download progress tracking.`,
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
            'HttpHeaders IMMUTABLE: headers.set("key", "val") trả về instance MỚI - phải gán lại hoặc chain',
            'observe: "response" cho full HttpResponse - lấy headers, status code, và body cùng lúc',
            'observe: "events" + reportProgress: true cho file upload progress bar',
            'Không hardcode headers trong service - dùng interceptor cho headers chung (Auth, Content-Type)'
          ]
        },
        {
          title: 'Error Handling',
          content: `**HTTP Error Handling - phân biệt client vs server errors**

**HttpErrorResponse có 2 loại:**
| Loại | error.status | error.error | Nguyên nhân |
|------|-------------|-------------|------------|
| Client error | 0 | ProgressEvent | Network, CORS, timeout |
| Server error | 4xx, 5xx | Response body | API trả về error |

**Error handling strategy:**
1. **Service level**: retry + catchError với default value
2. **Interceptor level**: Global handling (401 → redirect login, 500 → error page)
3. **Component level**: UI feedback (toast, error message)

**Best practice:** Xử lý ở interceptor cho global errors (auth, server down), ở service cho specific fallbacks.`,
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
          content: `**HTTP Interceptors - middleware cho HTTP requests**

Interceptor = middleware pattern: modify/log/handle EVERY request/response.

**Functional interceptors (Angular 15+) - RECOMMENDED:**
Function nhận (req, next) trả về Observable<HttpEvent>.
Dùng inject() cho dependencies.

**Execution order:**
- Request: chạy Từ ĐẦU đến cuối (interceptor 1 → 2 → 3 → server)
- Response: chạy NGƯỢC lại (server → 3 → 2 → 1)

**Common interceptors:**
| Interceptor | Mục đích |
|-------------|--------|
| Auth | Thêm Bearer token vào headers |
| Logging | Log request/response cho debug |
| Error | Global error handling (401 → refresh token → retry) |
| Loading | Show/hide loading spinner |
| Cache | Cache GET responses |
| Retry | Auto-retry failed requests |

**QUAN TRỌNG:** Request là IMMUTABLE - phải req.clone() để modify.`,
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
            'Functional interceptor: export const authInterceptor: HttpInterceptorFn = (req, next) => { ... } - không cần class',
            'req.clone({ headers: req.headers.set(...) }) - BẮT BUỘC clone, không modify trực tiếp',
            'Token refresh interceptor: catch 401 → refresh token → retry original request với new token',
            'withInterceptorsFromDi() để dùng class-based interceptors cũ cùng với functional interceptors mới'
          ]
        },
        {
          title: 'Caching & Optimization',
          content: `**HTTP Caching & Optimization patterns**

**Caching strategies:**
| Strategy | Cách | Use case |
|----------|------|----------|
| shareReplay(1) | Cache in Observable stream | Data hiếm thay đổi (config, metadata) |
| Map/Signal cache | Manual cache trong service | Full control, invalidation |
| HTTP Cache headers | Browser native cache | Static assets, CDN |
| Interceptor cache | Global cache layer | All GET requests |

**shareReplay pattern:**
\`data$ = http.get<T>(url).pipe(shareReplay({ bufferSize: 1, refCount: true }))\`
- bufferSize: 1 = cache 1 kết quả cuối
- refCount: true = auto-cleanup khi hết subscriber (QUAN TRỌNG!)
- refCount: false = cache vĩnh viễn (memory leak nếu data lớn)

**Invalidation:**
Dùng Subject trigger refresh: \`refresh$.pipe(switchMap(() => http.get(url)))\`

**Debounce cho search:**
\`searchTerm.pipe(debounceTime(300), distinctUntilChanged(), switchMap(term => http.get(url, {params: {q: term}})))\``,
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
            'shareReplay({ refCount: true }): refCount là CRITICAL - false = cache vĩnh viễn kể cả khi không ai subscribe',
            'switchMap cho search: cancel request cũ khi user gõ tiếp - chỉ request cuối cùng được xử lý',
            'Cache invalidation: dùng BehaviorSubject trigger + switchMap để force refresh khi cần',
            'HttpTransferCache (SSR): data fetch trên server được serialize vào HTML → client hydrate không cần fetch lại'
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
          content: `**Pipes - transform data trong template**

Pipe là function nhận value + parameters, trả về transformed value. Chạy trong template context.

**Tại sao dùng Pipe thay vì method trong template?**
- **Pure pipe**: Chỉ chạy khi input reference thay đổi (cached!)
- **Method call**: Chạy MỖI change detection cycle (expensive!)

**Built-in pipes thường dùng:**
| Pipe | Ví dụ | Kết quả |
|------|---------|--------|
| date | \`{{ d \| date:'dd/MM/yyyy' }}\` | 15/03/2024 |
| currency | \`{{ n \| currency:'VND' }}\` | ₫123 |
| number | \`{{ pi \| number:'1.0-2' }}\` | 3.14 |
| percent | \`{{ 0.85 \| percent }}\` | 85% |
| async | \`{{ data$ \| async }}\` | Subscribe + auto-unsub |
| json | \`{{ obj \| json }}\` | Debug display |
| keyvalue | \`@for (kv of map \| keyvalue)\` | Iterate over Map/Object |

**Pipe chaining:** \`{{ value | pipe1 | pipe2:arg }}\` - output của pipe1 là input của pipe2`,
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
          content: `**Async Pipe - best practice cho Observable trong template**

Async pipe làm 3 việc: subscribe, lấy latest value, unsubscribe khi destroy.

**Tại sao async pipe là best practice?**
1. **Tự động unsubscribe** - không memory leak
2. **Trigger OnPush CD** - markForCheck() tự động
3. **Ít code** - không cần subscribe/assign/unsubscribe trong component

**Patterns:**
- \`@if (data$ | async; as data)\` - subscribe 1 lần, dùng nhiều nơi trong block
- Multiple observables: combine với combineLatest trước, async pipe 1 lần
- Không dùng \`(data$ | async)\` nhiều lần trong cùng template (= nhiều subscriptions!)

**Async pipe là IMPURE pipe** nhưng Angular optimize nó - không có performance concern.`,
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
            'Dùng @if (obs$ | async; as data) - subscribe 1 lần, dùng "data" nhiều lần trong block',
            'KHÔNG dùng {{ obs$ | async }} nhiều lần = nhiều subscriptions = nhiều HTTP requests!',
            'Async pipe tự trigger markForCheck() - perfect với OnPush strategy',
            'Signals thay thế async pipe: {{ signal() }} - không cần pipe, đơn giản hơn'
          ]
        },
        {
          title: 'Custom Pipes',
          content: `**Custom Pipes - tạo transformation logic riêng**

Pipe = @Pipe decorator + implement PipeTransform interface.

**Khi nào tạo custom pipe?**
- Format data lặp đi lặp lại (truncate, relative time, file size)
- Business logic transform (status → label, role → permissions)
- Thay thế method calls trong template (PERFORMANCE!)

**Pure vs Impure:**
- \`pure: true\` (default): Chỉ chạy khi input **reference** thay đổi. Cached!
- \`pure: false\`: Chạy MỖI CD cycle. Expensive!

**Rule:** Luôn dùng pure pipe + immutable data. Impure pipe chỉ khi thực sự cần detect mutations.

**standalone: true** (Angular 14+) - pipe có thể import trực tiếp, không cần module.`,
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
          content: `**Pure vs Impure Pipes - performance impact**

| | Pure (default) | Impure (pure: false) |
|--|----------------|---------------------|
| Chạy khi | Input reference thay đổi | **MỖI CD cycle** |
| Mutate array | KHÔNG detect | Detect |
| Performance | Tốt (cached) | **Có thể chậm** |
| instances | Một instance per usage | Một instance per usage |

**Vấn đề của Pure pipe + mutation:**
\`this.items.push(newItem)\` → Pure pipe KHÔNG chạy lại (reference không đổi)
\`this.items = [...this.items, newItem]\` → Pure pipe chạy lại ✔ (reference mới)

**Best practice:** Pure pipe + immutable data patterns. KHAI BÁO không dùng impure pipe.

**Async pipe là impure** nhưng Angular optimize internal - không có performance concern.

**Alternative cho filter pipe:** Dùng computed signal hoặc component logic thay vì impure filter pipe.`,
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
            'KHAI BÁO dùng Pure pipe + immutable data: [...array, newItem] thay vì array.push()',
            'Impure pipe chạy MỖI CD cycle - với 100 items và 20 CD cycles/s = 2000 lần/s',
            'Thay vì impure filter pipe: dùng computed signal hoặc filter trong component class',
            'Method call trong template = impure pipe (chạy mỗi CD). Dùng pipe hoặc computed signal thay thế'
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
          content: `**Change Detection - cơ chế sync Model → View**

CD là quá trình Angular so sánh giá trị mới với giá trị cũ của MỖI binding trong template.

**Trigger chain:**
Async event → Zone.js intercept → ApplicationRef.tick() → CD từ root → lá

**2 strategies và impact:**
| | Default | OnPush |
|--|---------|--------|
| Check khi | MỖI CD cycle | Input ref thay đổi / Event / markForCheck / Signal |
| Performance | O(n) - check tất cả bindings | O(k) - skip subtree nếu clean |
| Dùng với | Mutation ok | **Immutable data + signals** |
| Recommendation | Small apps | **Mặc định cho mọi component** |

**OnPush trigger conditions:**
1. @Input() reference thay đổi (strict equality check)
2. DOM event trong component (click, input, etc.)
3. async pipe emit new value (gọi markForCheck)
4. Signal thay đổi (Angular 17+ tự mark dirty)
5. Manual: ChangeDetectorRef.markForCheck()

**Best practice:** OnPush + Signals cho Mọi component. Default chỉ cho prototype.`,
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
            'OnPush + Signals = BEST performance. Signal thay đổi tự mark component dirty - không cần Zone.js',
            'OnPush với mutation: this.user.name = "new" KHÔNG trigger CD! Phải: this.user = {...this.user, name: "new"}',
            'markForCheck() marks từ component đến ROOT (all ancestors) - khác detectChanges() chỉ check subtree',
            'Angular CLI: ng generate component --change-detection OnPush - set OnPush làm default cho project'
          ]
        },
        {
          title: 'LView & TView Internals (Deep Dive)',
          content: `**LView & TView - Angular's internal rendering structures**

**Tại sao cần biết?** Debug performance issues, hiểu tại sao binding không update, optimize CD.

**TView (Template View) - static, shared:**
- Tạo 1 lần per component TYPE (không phải per instance)
- Chứa: template function, directive definitions, binding indices
- Giống "blueprint" của component

**LView (Logical View) - runtime, per instance:**
- Mỗi component instance có 1 LView riêng
- Là ARRAY (không phải object) cho performance
- Chứa: binding values, DOM references, component instance, flags

**Dirty checking bản chất:**
1. Với mỗi binding index trong LView:
2. Tính giá trị mới của expression
3. So sánh với giá trị cũ (đã lưu)
4. Nếu khác: update DOM + lưu giá trị mới
5. Nếu giống: skip (không touch DOM)

**Dev mode: ExpressionChangedAfterItHasBeenCheckedError**
Angular check 2 lần trong dev mode - nếu lần 2 khác lần 1 → throw error. Production mode không check.`,
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
            'LView là Array cho performance - array index access nhanh hơn object property lookup',
            'ExpressionChangedAfterItHasBeenCheckedError: giá trị thay đổi GIỮA 2 lần check - fix bằng async update hoặc redesign data flow',
            'ng.getComponent($0) trong DevTools console - lấy component instance từ selected DOM element',
            'Angular DevTools extension: visualize component tree, CD cycles, performance profiling'
          ]
        },
        {
          title: 'CD Trigger Mechanism',
          content: `**CD Trigger Mechanism - Zone.js vs Signals**

**Zone.js flow (traditional):**
1. Async event (click, HTTP, timer)
2. Zone.js đã monkey-patch API → intercept callback
3. Callback execute trong Angular zone
4. Zone notify: "microtask queue empty"
5. Angular gọi ApplicationRef.tick()
6. tick() chạy CD từ ROOT xuống (top-down)

**OnPush flag mechanism:**
- Mỗi LView có DIRTY flag
- OnPush component: CD chỉ check NẾU flag = dirty
- markForCheck(): set dirty từ component đến ROOT (all ancestors)
- async pipe gọi markForCheck() khi emit

**Signal-based CD (Angular 17+):**
1. Signal.set() → mark consumer component dirty
2. Schedule CD qua requestAnimationFrame (không cần Zone.js!)
3. Chỉ check dirty components (không check từ root)

**Key insight:** Signals = targeted CD (chỉ components dùng signal). Zone.js = blanket CD (từ root xuống).`,
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
            'OnPush skip TOÀN BỘ subtree nếu component không dirty - huge performance gain cho deep trees',
            'markForCheck() marks UP: component → parent → root. detectChanges() runs DOWN: component → children',
            'Signals tự mark dirty + schedule CD - không cần Zone.js, không cần markForCheck()',
            'eventCoalescing: provideZoneChangeDetection({ eventCoalescing: true }) - batch nhiều events thành 1 CD cycle'
          ]
        },
        {
          title: 'Zoneless & Signals CD',
          content: `**Zoneless Angular - tương lai của Change Detection**

**provideExperimentalZonelessChangeDetection() (Angular 18+):**
Loại bỏ Zone.js hoàn toàn. CD chỉ chạy khi:
- Signal thay đổi
- DOM event handlers
- Manual trigger (ChangeDetectorRef)

**Lợi ích:**
| Metric | Với Zone.js | Zoneless |
|--------|------------|----------|
| Bundle size | +15KB (Zone.js) | **Nhỏ hơn** |
| CD triggers | Mọi async operation | **Chỉ khi cần** |
| Performance | CD từ root mỗi event | **Targeted CD** |
| Debug | Zone.js stack traces dài | **Clean stack traces** |
| SSR | Zone.js issues | **Native support** |

**Migration path:**
1. OnPush cho tất cả components
2. Chuyển BehaviorSubject → Signals cho UI state
3. Dùng async pipe hoặc toSignal() cho RxJS streams
4. Test với zoneless mode
5. Loại bỏ Zone.js import

**Lưu ý:** Third-party libraries phải compatible. Libraries dùng setTimeout để trigger CD sẽ không hoạt động.`,
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
            'Zoneless giảm ~15KB bundle + performance gain đáng kể vì không CD mỗi async event',
            'Migrate to signals TRƯỚC khi go zoneless - signals là cơ chế trigger CD duy nhất',
            'provideZoneChangeDetection({ eventCoalescing: true }) - bước đệm: giữ Zone.js nhưng optimize',
            'Third-party libs dùng Zone.js internally (setTimeout trigger CD) sẽ break - kiểm tra compatibility trước'
          ]
        },
        {
          title: 'NgZone & runOutsideAngular',
          content: `**NgZone - kiểm soát khi nào CD chạy**

NgZone là Angular's wrapper quanh Zone.js. Cho phép chạy code NGOAI Angular zone → không trigger CD.

**Khi nào dùng runOutsideAngular?**
- **Animations**: requestAnimationFrame loop (60fps = 60 CD/s nếu trong zone!)
- **WebSocket**: Messages liên tục, chỉ cần update UI theo batch
- **Mouse move/scroll**: High-frequency events
- **Heavy computation**: Worker-like operations
- **Third-party libs**: Libraries không cần Angular CD

**Pattern:**
\`ngZone.runOutsideAngular(() => { ... })\` - code trong đây không trigger CD
\`ngZone.run(() => { ... })\` - quay lại Angular zone khi cần update view

**Với Signals (tương lai):** runOutsideAngular ít cần hơn vì Signals chỉ mark component cụ thể, không trigger global CD.`,
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
            'Animation loop trong zone = 60 CD cycles/s. runOutsideAngular + zone.run() khi cần update = chỉ 1 CD',
            'WebSocket: runOutsideAngular để nhận messages, zone.run() để batch update UI',
            'Zoneless mode: runOutsideAngular không cần nữa vì không có Zone.js để trigger CD',
            'afterRender/afterNextRender (Angular 17+) chạy NGOAI zone mặc định - an toàn cho DOM manipulation'
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
          content: `**Angular Testing - tools và strategies**

**Test runners:**
| Runner | Status | Notes |
|--------|--------|-------|
| Karma + Jasmine | Default (legacy) | Browser-based, chậm |
| Jest | **Recommended** (Angular 16+) | Nhanh, snapshot testing, popular |
| Vitest | Community support | Fastest, ESM native |
| Web Test Runner | Experimental (Angular 17+) | Browser-based, modern |

**Testing pyramid:**
| Loại | Số lượng | Tốc độ | Coverage |
|------|----------|---------|----------|
| Unit | **Nhiều nhất** | Nhanh | Logic, pipes, services |
| Integration | Vừa | Vừa | Component + template + dependencies |
| E2E | **Ít nhất** | Chậm | Critical user flows |

**Key test utilities:**
- **TestBed**: Angular's testing DI container - configure providers, imports
- **ComponentFixture**: Wrapper quanh component - access DOM, trigger CD
- **fakeAsync + tick**: Test async code synchronously
- **provideHttpClientTesting()**: Mock HTTP với HttpTestingController (standalone)
- **fixture.componentRef.setInput()**: Set signal inputs trong tests`,
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
            'fixture.detectChanges() PHẢI gọi sau mỗi state change để template update - quên là test fail',
            'fakeAsync + tick(): test setTimeout/setInterval synchronously - tick(1000) tiến 1s',
            'provideHttpClientTesting() thay HttpClientTestingModule cho standalone components',
            'fixture.componentRef.setInput("name", value) cho signal inputs - không dùng component.name trực tiếp'
          ]
        },
        {
          title: 'Testing Services',
          content: `**Testing Services - isolated và integration tests**

**Isolated test (không TestBed):**
Tạo service instance trực tiếp với mock dependencies - nhanh, đơn giản.

**Integration test (với TestBed):**
Dùng TestBed để inject real/mock dependencies - giống production hơn.

**HTTP testing pattern:**
1. Configure TestBed với provideHttpClientTesting()
2. Inject service + HttpTestingController
3. Gọi service method (subscribe!)
4. httpMock.expectOne(url) - assert request đã được gửi
5. req.flush(mockData) - trả về mock response
6. httpMock.verify() - đảm bảo không có unexpected requests

**Signal-based services:**
Test signals trực tiếp: service.count() === 0, service.increment(), expect(service.count()).toBe(1)`,
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
          content: `**Testing Components - mock strategies**

**Mock strategies (chọn đúng cách):**
| Strategy | Khi nào | Ví dụ |
|----------|---------|--------|
| jasmine.createSpyObj() | Nhanh, đơn giản | Service với vài methods |
| Stub class | Complex mock | Service với state |
| overrideComponent | Thay template/providers | Testing với different template |
| Real service | Integration test | Test service + component cùng lúc |

**Testing signal-based components:**
- fixture.componentRef.setInput('name', 'value') cho signal inputs
- Signals update synchronously - KHÔNG cần fakeAsync
- computed() cũng update ngay - chỉ cần detectChanges() cho template

**DOM testing:**
- fixture.nativeElement.querySelector() cho basic queries
- fixture.debugElement.query(By.css()) cho advanced (directive, component)
- By.directive(MyComponent) để tìm child components`,
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
            'jasmine.createSpyObj("Svc", ["method1", "method2"]) - nhanh nhất cho simple mocks',
            'Signal inputs: fixture.componentRef.setInput("name", value) - không dùng component.name = value',
            'Signals là synchronous - KHÔNG cần fakeAsync/tick. Chỉ detectChanges() cho template',
            'By.css(".class"), By.directive(Component) - query DOM với DebugElement cho type-safe testing'
          ]
        },
        {
          title: 'Testing Forms',
          content: `**Testing Forms - reactive và template-driven**

**Reactive forms (dễ test hơn):**
- Test form model trực tiếp trong class (không cần DOM)
- Set values: form.setValue() / form.patchValue()
- Check validity: form.valid, control.hasError('required')
- Check status: form.status === 'VALID' / 'INVALID' / 'PENDING'

**Template-driven forms (cần DOM):**
- Cần fixture.detectChanges() để sync model → view
- Dùng fakeAsync + tick() cho ngModel async update
- Query input: fixture.debugElement.query(By.css('input'))

**Testing custom validators:**
Test validator function trực tiếp với mock AbstractControl - không cần TestBed!

**Testing async validators:**
fakeAsync + tick(debounceTime) + httpMock.expectOne() để test full flow.`,
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
          content: `**Testing với Signals - đơn giản hơn RxJS**

Signals là synchronous - testing đơn giản hơn nhiều so với Observables.

**Test signal values:**
\`expect(component.count()).toBe(0)\` - đọc giá trị trực tiếp

**Test signal inputs:**
\`fixture.componentRef.setInput('user', mockUser)\` - set input và trigger CD

**Test computed:**
Computed update synchronously:
\`component.count.set(5); expect(component.doubled()).toBe(10);\`

**Test effects:**
Effects chạy trong microtask - dùng \`TestBed.flushEffects()\` (Angular 18+) hoặc fakeAsync + tick().

**Test signal-based services:**
\`const store = TestBed.inject(TodoStore);\`
\`store.addTodo('test');\`
\`expect(store.todos().length).toBe(1);\`
- Không cần subscribe, không cần async - trực tiếp và nhanh.`,
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
            'Signals là SYNCHRONOUS - expect(sig()).toBe(value) ngay sau set(). Không cần fakeAsync/tick',
            'fixture.componentRef.setInput("propName", value) - cách đúng để set signal inputs trong tests',
            'TestBed.flushEffects() (Angular 18+) - force effects chạy ngay thay vì đợi microtask',
            'computed() update ngay khi dependency thay đổi - test đơn giản: set dependency, assert computed value'
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
          content: `**Ivy Compiler - Angular's rendering engine (v9+)**

Ivy là complete rewrite của Angular renderer. Hiểu Ivy = hiểu tại sao Angular nhanh.

**Ivy vs View Engine:**
| | View Engine | Ivy |
|--|-------------|-----|
| Compilation | Global analysis | **Locality** (mỗi component độc lập) |
| Tree-shaking | Khó | **Dễ** (instructions import explicitly) |
| Build speed | Chậm (global) | **Nhanh** (incremental) |
| Bundle | Lớn | **Nhỏ** (chỉ include cái dùng) |
| Debug | Khó | **Dễ** (generated code readable) |

**Ivy compilation pipeline:**
1. **Template parsing**: HTML → AST (Abstract Syntax Tree)
2. **Type checking**: Verify bindings match TypeScript types (strictTemplates)
3. **IR (Intermediate Representation)**: AST → optimizable IR
4. **Template instructions**: IR → ɹɹ functions (ɹɹelement, ɹɹtextInterpolate...)
5. **ComponentDef generation**: Metadata + template function + styles

**Incremental DOM (khác Virtual DOM của React):**
- Virtual DOM: Tạo tree mới, diff với tree cũ, patch DOM
- Incremental DOM: Instructions trực tiếp tạo/update DOM elements - KHÔNG cần tree trung gian
- Kết quả: ít memory allocation hơn, tree-shakable instructions`,
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
            'ɵɵ prefix (theta theta) = internal Angular API. ɵɵelement tạo DOM element, ɵɵtextInterpolate update text',
            'RenderFlags.Create chạy 1 lần (tạo DOM). RenderFlags.Update chạy mỗi CD (update bindings)',
            'Incremental DOM = instructions modify DOM trực tiếp, không Virtual DOM tree - ít memory hơn React',
            'strictTemplates: true trong tsconfig.json - Ivy type-check template bindings tại compile time'
          ]
        },
        {
          title: 'Zone.js Mechanics',
          content: `**Zone.js - tại sao Angular biết khi nào update UI**

Zone.js monkey-patch TẤT CẢ async APIs của browser để track khi nào async operations hoàn thành.

**Monkey-patched APIs:**
| Category | APIs |
|----------|------|
| Timers | setTimeout, setInterval, requestAnimationFrame |
| Promises | Promise, MutationObserver |
| Events | addEventListener, removeEventListener |
| HTTP | XMLHttpRequest, fetch |
| Others | queueMicrotask, process.nextTick (Node) |

**Angular's NgZone flow:**
1. User clicks button → addEventListener (monkey-patched)
2. Handler chạy trong Angular zone
3. Handler gọi HTTP request (monkey-patched)
4. Response về → callback chạy trong zone
5. Microtask queue empty → Zone notify Angular
6. Angular gọi ApplicationRef.tick() → CD từ root

**Vấn đề của Zone.js:**
- Bundle size: ~15KB
- Performance: Mọi async event trigger CD (kể cả không liên quan UI)
- Compatibility: Một số APIs không patch được (Canvas, WebGL)
- Stack traces: Dài và khó đọc

**Tương lai:** Angular hướng tới Zoneless với Signals - không cần monkey-patching nữa.`,
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
            'Zone.js là lý do Angular "magic" - bạn không cần gọi detectChanges() thủ công',
            'runOutsideAngular() cho: animations (60fps!), WebSocket, scroll/mousemove, heavy computation',
            'Zone.js ~15KB + trigger CD mỗi async event = Zoneless với Signals là tương lai',
            'Debug tip: NgZone.isInAngularZone() kiểm tra code đang chạy trong zone hay ngoài'
          ]
        },
        {
          title: 'Change Detection Internals',
          content: `**Change Detection Internals - algorithm chi tiết**

**CD algorithm (simplified):**
1. ApplicationRef.tick() được gọi
2. Với mỗi root view: refreshView()
3. refreshView() cho mỗi component:
   a. Check OnPush flag - skip nếu clean
   b. Update input bindings
   c. Gọi ngDoCheck, ngAfterContentChecked
   d. Với mỗi binding: so sánh new vs old value
   e. Nếu khác: update DOM node, lưu new value
   f. Recurse vào child views
4. Gọi ngAfterViewChecked

**Dirty checking vs Reactive tracking:**
| | Angular (Dirty checking) | Vue/MobX (Reactive) |
|--|--------------------------|---------------------|
| Track changes | KHÔNG - check tất cả | CÓ - biết chính xác |
| Performance | O(n) bindings | O(1) per change |
| Trade-off | Đơn giản, predictable | Phức tạp, hiệu quả |

**Signals thay đổi game:** Angular với Signals = reactive tracking → biết chính xác component nào cần update.

**LView là Array:** Binding values được lưu tại index cụ thể trong LView array. So sánh = strict equality (===).`,
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
            'OnPush + Immutable + Signals = Angular CD đạt hiệu quả gần như reactive frameworks',
            'ExpressionChangedAfterItHasBeenCheckedError: Angular check 2 lần trong dev mode - fix bằng redesign data flow',
            'Signals cho phép Angular biết CHÍNH XÁC binding nào thay đổi - không cần dirty check toàn bộ',
            'Angular DevTools: Profile tab hiển thị CD cycles, thời gian mỗi component - tìm bottleneck'
          ]
        },
        {
          title: 'Dependency Injection Internals',
          content: `**DI Internals - resolution algorithm và edge cases**

Angular DI là một trong những DI systems phức tạp nhất trong frontend frameworks.

**2 Injector Trees (song song):**
| Tree | Tạo bởi | Scope |
|------|---------|-------|
| **Element Injector** | Component providers | Component + descendants |
| **Environment Injector** | providedIn:'root', route providers, NgModule | App/feature wide |

**Resolution algorithm chi tiết:**
1. ElementInjector của component hiện tại
2. ↑ ElementInjector của parent component
3. ↑ ... lên đến root component
4. → Cross sang EnvironmentInjector
5. ↑ Feature EnvironmentInjector (lazy routes)
6. ↑ Root EnvironmentInjector
7. ↑ Platform Injector
8. ↑ NullInjector → throw NullInjectorError

**Resolution modifiers:**
- @Optional(): trả về null thay vì throw
- @Self(): CHỈ tìm trong element injector hiện tại
- @SkipSelf(): Bỏ qua current, tìm từ parent
- @Host(): Chỉ tìm đến host component (cho directives)

**Circular dependency:** A inject B, B inject A → Angular detect và throw. Fix: forwardRef() hoặc redesign.`,
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
            'providedIn:"root" = tree-shakable: service không ai inject = removed từ bundle tự động',
            'Element injector ưu tiên hơn environment - component providers OVERRIDE root singleton',
            '@Self() + @Optional() combo: tìm trong current injector, trả null nếu không có (không throw)',
            'Circular dependency: forwardRef() là workaround, nhưng thường signal design problem - refactor để break cycle'
          ]
        },
        {
          title: 'Signals Under the Hood',
          content: `**Signals Under the Hood - reactive graph internals**

Signals tạo DAG (Directed Acyclic Graph) với push notification + pull evaluation.

**ReactiveNode internal structure:**
- value: giá trị hiện tại
- version: tăng mỗi lần set() - consumers so sánh version để biết có cần re-compute
- producerNodes: Set các dependencies
- consumerNodes: Set các dependents
- dirty: boolean flag cho lazy evaluation

**Algorithm khi signal.set():**
1. Update value + increment version
2. Mark TẤT CẢ consumers dirty (PUSH phase - nhanh, chỉ set flag)
3. KHÔNG recalculate consumers (LAZY!)
4. Khi consumer được đọc: check dirty flag
5. Nếu dirty: recalculate + update value + clear flag (PULL phase)
6. Nếu clean: return cached value

**Glitch-free guarantee:**
Computed A depends on B và C. B và C thay đổi cùng lúc.
Không bao giờ đọc A thấy giá trị với B mới + C cũ (inconsistent).
Angular dùng topological sort đảm bảo đúng thứ tự.

**Equality check:** signal() dùng Object.is() mặc định. Custom: signal(val, { equal: deepEqual })`,
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
            'Push-Pull hybrid: push chỉ set dirty flag (O(1)), pull recalculate khi đọc - lazy và hiệu quả',
            'computed() với 10 dependencies nhưng không ai đọc = không bao giờ calculate. Zero cost!',
            'Custom equality: signal(data, { equal: (a, b) => a.id === b.id }) - tránh unnecessary re-renders',
            'signal.set() với giá trị EQUAL (Object.is) = KHÔNG mark dirty, KHÔNG notify consumers'
          ]
        },
        {
          title: 'Tree Shaking & Bundle Optimization',
          content: `**Tree Shaking & Bundle Optimization - giảm size thực tế**

**Tree shaking là gì?**
Build tool (webpack/esbuild) phân tích import graph, loại bỏ code không được reference.

**Tại sao Ivy tree-shakable?**
- Template compile thành import cụ thể: \`import { ɹɹelement } from '@angular/core'\`
- Không dùng *ngIf = không import ɹɹtemplate instruction
- providedIn: 'root' = service chỉ include NẾU được inject

**Bundle optimization techniques:**
| Technique | Impact | Effort |
|-----------|--------|--------|
| Lazy loading routes | **Cao** | Thấp |
| @defer cho heavy components | **Cao** | Thấp |
| Import cụ thể (\`import { map }\`) | Trung bình | Thấp |
| Remove unused dependencies | Trung bình | Thấp |
| providedIn:'root' (tree-shakable services) | Trung bình | Thấp |
| esbuild (Angular 17+ default) | **Cao** | Tự động |

**Bundle analysis:** \`npx ng build --stats-json\` + webpack-bundle-analyzer hoặc source-map-explorer

**Budget (angular.json):** Set warning/error limits cho bundle size - CI fail nếu vượt.`,
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
            'import { map } from "rxjs" (tree-shakable) vs import * as rxjs (include TOÀN BỘ - 200+ operators!)',
            'npx ng build --stats-json && npx webpack-bundle-analyzer dist/stats.json - xem bundle composition',
            'Budget trong angular.json: "maximumWarning": "500kb", "maximumError": "1mb" - CI/CD gate',
            'esbuild (Angular 17+ default) nhanh hơn webpack 10x và bundle nhỏ hơn - upgrade là free win'
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
          content: `**Smart vs Dumb Components - pattern cơ bản nhất**

**Smart (Container):**
- Inject services, biết state management
- Fetch data, handle errors
- Coordinate child components
- Thường là routed components

**Dumb (Presentational):**
- CHỈ giao tiếp qua input()/output()
- Không inject services (trừ pure UI như animation)
- OnPush + pure rendering
- Reusable across features

**Ratio lý tưởng:** ~20% smart, 80% dumb

**Tại sao pattern này quan trọng?**
| Lợi ích | Giải thích |
|---------|------------|
| Testing | Dumb: chỉ test UI với mock inputs. Smart: mock services |
| Performance | Dumb + OnPush = skip CD khi inputs không đổi |
| Reusability | Dumb component dùng được ở nhiều features |
| Maintainability | Logic tập trung ở smart, UI tập trung ở dumb |

**Với Signals:** Dumb components nhận signal inputs, emit outputs. Smart components hold state as signals.`,
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
            'Dumb + OnPush là cặp đôi hoàn hảo: input không đổi reference = skip toàn bộ component subtree',
            'Smart component = routed component (UserListPage) điều khiển nhiều dumb components',
            'Dumb component KHÔNG inject Router, HttpClient, Store - chỉ nhận data qua inputs',
            'Signal inputs tạo natural boundary: smart hold WritableSignal, pass ReadonlySignal cho dumb'
          ]
        },
        {
          title: 'State Management Patterns',
          content: `**State Management - chọn đúng pattern cho scale**

**Levels of state:**
| Level | Scope | Lifetime | Ví dụ |
|-------|-------|----------|--------|
| Component | 1 component | Component lifetime | Form input, toggle |
| Feature | Feature module | While feature active | Filter, selected item |
| Application | Toàn app | App lifetime | Auth, theme, cart |

**So sánh giải pháp:**
| Solution | Complexity | Boilerplate | Best for |
|----------|------------|-------------|----------|
| **signal() in service** | Thấp | Ít | Small-medium apps |
| **NgRx SignalStore** | Trung bình | Vừa | Feature stores |
| **NgRx Store** | Cao | Nhiều | Enterprise, time-travel debug |
| **NGXS** | Trung bình | Ít hơn NgRx | Medium apps |

**Recommended path:**
1. Bắt đầu với signal() + service (90% apps đủ)
2. Scale lên NgRx SignalStore khi cần structure
3. Full NgRx Store chỉ khi cần: time-travel debugging, complex side effects, team conventions

**Signal Store pattern:**
Private WritableSignal + public ReadonlySignal + computed derived state + methods modify state.`,
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
            'Start với signal() + service - 90% apps không cần NgRx. Over-engineering là anti-pattern',
            'Feature store: service với signals cho từng feature, providedIn lazy route - auto destroy khi navigate away',
            'computed() cho derived state: filter, sort, count, isEmpty - auto-update, cached, zero cost khi không đọc',
            'NgRx SignalStore (2024+): structured signal store với withState, withMethods, withComputed - best of both worlds'
          ]
        },
        {
          title: 'Facade Pattern',
          content: `**Facade Pattern - abstract layer giữa components và state**

Facade = service cung cấp simple API, ẩn complexity của state management + API calls + side effects.

**Tại sao dùng Facade?**
| Vấn đề | Không Facade | Với Facade |
|---------|-------------|------------|
| Component inject | 5+ services | 1 facade |
| Refactor store | Sửa mọi component | Sửa 1 facade |
| Testing | Mock nhiều services | Mock 1 facade |
| Cross-cutting | Logic rải rác | Tập trung |

**Facade với Signals (modern pattern):**
- Expose readonly signals cho UI: \`readonly users = this.store.users\`
- Expose computed cho derived state: \`readonly isEmpty = computed(() => this.users().length === 0)\`
- Methods cho actions: \`loadUsers(), deleteUser(id), updateFilter(filter)\`
- Handle side effects: notifications, navigation, error handling

**Khi nào KHÔNG cần Facade?**
Small features với 1-2 services. Facade cho simple case = over-engineering.`,
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
            'Facade = single entry point: component inject 1 Facade thay vì 5 services',
            'Expose CHỈ readonly signals + methods. KHAI BÁO không expose WritableSignal ra ngoài',
            'Facade handle orchestration: loadUser() = call API + update store + show notification + handle error',
            'Test facade: mock internal services. Test component: mock facade. Clean separation!'
          ]
        },
        {
          title: 'Domain-Driven Design in Angular',
          content: `**Domain-Driven Design in Angular - structure cho large apps**

DDD giúp tổ chức code theo business domain thay vì technical type.

**DDD mapping vào Angular:**
| DDD Concept | Angular Implementation |
|-------------|----------------------|
| Bounded Context | Feature folder (lazy-loaded) |
| Aggregate Root | Main entity + related models |
| Domain Service | Business logic service |
| Application Service | Facade (orchestrate use cases) |
| Repository | API service (data access) |
| Value Object | Immutable interfaces/types |

**Folder structure (2025 best practice):**
Organize by FEATURE (domain), không phải by TYPE:
- ✔ \`features/users/\` chứa components, services, models, routes
- ✘ \`components/\`, \`services/\`, \`models/\` (tách logic ra khắp nơi)

**Public API (index.ts):**
Mỗi feature export chỉ những gì features khác cần - encapsulation.

**Core vs Shared:**
- **Core**: Singleton services, guards, interceptors (import 1 lần)
- **Shared**: Reusable dumb components, pipes, directives (import nhiều nơi)`,
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
            'Feature folder = Bounded Context: tất cả code liên quan 1 feature ở cùng 1 chỗ',
            'index.ts làm public API: import { UserFacade } from "@features/users" - không import internal files',
            'Domain layer (models, business logic) KHÔNG depend vào Angular - pure TypeScript, dễ test',
            'Nx monorepo: enforce boundaries giữa features với lint rules - prevent tích hợp chặt'
          ]
        },
        {
          title: 'Performance Patterns',
          content: `**Performance Patterns - optimization checklist**

**1. Change Detection:**
- OnPush cho Mọi component (schematic default)
- Signals thay vì BehaviorSubject cho UI state
- trackBy/@for track cho lists
- Pure pipes thay method calls trong template

**2. Bundle Size:**
- Lazy loading routes + @defer cho components
- Import cụ thể (import { map } không import *)
- providedIn: 'root' (tree-shakable services)
- esbuild (Angular 17+ default)

**3. Runtime:**
- runOutsideAngular cho animations, heavy computation
- Virtual scrolling (CDK) cho long lists
- Web Workers cho CPU-intensive tasks
- Image optimization với NgOptimizedImage

**4. Memory:**
- Unsubscribe (takeUntilDestroyed, async pipe)
- @defer cleanup (auto khi leave viewport)
- Avoid closure leaks trong subscriptions

**Measurement tools:**
Angular DevTools profiler, Lighthouse, Chrome DevTools Performance tab, webpack-bundle-analyzer`,
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
            'MEASURE trước khi optimize - Angular DevTools Profiler tab hiển thị CD time per component',
            'OnPush + Signals + trackBy = 3 quick wins lớn nhất cho CD performance',
            'NgOptimizedImage: lazy loading, srcset, priority cho LCP image - dùng cho mọi <img>',
            '@defer (on viewport) cho below-fold content - giảm initial bundle và LCP đáng kể'
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
          content: `**NgModule - legacy module system (hiểu để maintain code cũ)**

Angular 17+ khuyến khích standalone components, nhưng phần lớn enterprise projects vẫn dùng NgModule.

**NgModule metadata:**
| Property | Mục đích | Lưu ý |
|----------|---------|--------|
| declarations | Components/directives/pipes | Mỗi item CHỈ declare trong 1 module |
| imports | Modules cần dùng | Import = dùng được exports của module đó |
| exports | Items chia sẻ ra ngoài | Không export = chỉ dùng nội bộ module |
| providers | Services (module-scoped) | Prefer providedIn:'root' thay vì đặt ở đây |
| bootstrap | Root component | Chỉ AppModule có property này |

**Vấn đề của NgModule:**
- Phải declare component trong module trước khi dùng
- Phải import CommonModule ở khắp nơi (cho *ngIf, *ngFor)
- Không tree-shakable (import module = include tất cả)
- Component không tự khai báo dependencies

**Standalone là tương lai:** Component tự khai báo imports, không cần module wrapper.`,
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
            'Component không standalone CHỈ declare trong 1 module - declare 2 nơi = compile error',
            'Không export = private cho module đó. Export = public API của module',
            'Standalone components import TRỰC TIẾP dependencies - tự document, tree-shakable',
            'Migration: ng generate @angular/core:standalone - schematic tự động chuyển sang standalone'
          ]
        },
        {
          title: 'Feature Modules',
          content: `**Feature Modules - tổ chức code trong NgModule world**

Feature module = module chứa tất cả code của 1 feature (components, services, routes).

**Loại modules:**
| Loại | Mục đích | Import |
|------|---------|--------|
| Feature | Business feature (Users, Products) | Lazy load |
| Shared | Reusable components/pipes/directives | Import nhiều nơi |
| Core | Singleton services, guards | Import 1 lần (AppModule) |

**Lazy loading NgModule:**
\`{ path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule) }\`

**Modern equivalent (standalone):**
\`{ path: 'users', loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES) }\`
Không cần module wrapper - routes file đủ.

**Khi nào còn dùng Feature Modules?**
Legacy projects, third-party libs chưa support standalone, team conventions.`,
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
          content: `**SharedModule - reusable UI elements**

SharedModule chứa "dumb" components, pipes, directives dùng chung.

**Rules cho SharedModule:**
1. CHỈ chứa presentational (dumb) items
2. KHÔNG provide services (gây multiple instances!)
3. Export TẤT CẢ items và re-export CommonModule, FormsModule
4. Không import feature modules

**Modern alternative (standalone):**
Không cần SharedModule! Mỗi component/pipe/directive là standalone, import trực tiếp.

**Ví dụ migration:**
Cũ: \`imports: [SharedModule]\` (import 50 components dù chỉ cần 1)
Mới: \`imports: [ButtonComponent, TruncatePipe]\` (chỉ import cái cần - tree-shakable!)`,
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
            'SharedModule + services = BUG: mỗi lazy module import SharedModule = service instance MỚI',
            'Standalone components thay thế SharedModule - import trực tiếp, tree-shakable, explicit',
            'Re-export CommonModule từ SharedModule để feature modules không cần import riêng',
            'ng generate @angular/core:standalone - tool tự động chuyển từ NgModule sang standalone'
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
          content: `***ngIf - conditional rendering (legacy, dùng @if cho code mới)**

*ngIf là structural directive - XÓA element khỏi DOM khi false (khác [hidden] chỉ CSS display:none).

**So sánh *ngIf vs @if:**
| | *ngIf | @if |
|--|------|-----|
| Import | Cần CommonModule/NgIf | **Không cần** (built-in) |
| Syntax | Directive + ng-template | **Block syntax** (clean) |
| else | ng-template #ref | **@else if / @else** (simple) |
| Performance | Directive overhead | **Compiled directly** (nhanh hơn) |
| Tree-shaking | Không | **Có** |

***ngIf microsyntax:** \`*ngIf="expr"\` = \`<ng-template [ngIf]="expr">\` - Angular transform khi compile.

**[hidden] vs *ngIf:** *ngIf xóa/tạo lại DOM (đắt với complex components). [hidden] giữ DOM (đắt với memory). Chọn tùy use case.`,
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
            '*ngIf XÓA/TẠO LẠI DOM. Component bên trong bị destroy/recreate. [hidden] giữ DOM + component instance',
            '*ngIf="obs$ | async as data" - subscribe 1 lần, dùng "data" trong block. Migrate sang @if cho code mới',
            'ng-template là "virtual" - không render cho đến khi structural directive tạo view từ nó',
            'Migration: ng generate @angular/core:control-flow - tự động *ngIf → @if'
          ]
        },
        {
          title: '*ngFor - Loop Rendering',
          content: `***ngFor - list rendering (legacy, dùng @for cho code mới)**

**So sánh *ngFor vs @for:**
| | *ngFor | @for |
|--|-------|------|
| trackBy | Optional (được khuyến khích) | **BắT BUỘC** (compiler enforce) |
| Empty state | *ngIf check length | **@empty block** (built-in) |
| Import | CommonModule/NgForOf | **Không cần** |
| Algorithm | Diffing | **Track-based** (nhanh hơn) |

**trackBy cực kỳ quan trọng:**
Không trackBy: Angular xóa TOÀN BỘ DOM và tạo lại khi array reference thay đổi!
Với trackBy: Angular biết item nào thêm/xóa/move - chỉ update DOM cần thiết.

**Local variables:** index, first, last, even, odd, count - truy cập qua \`let\` syntax.

**@for nhanh hơn:** Không dùng Iterable differ algorithm, track trực tiếp bằng identity function.`,
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
            'trackBy: return item.id (unique). Không return index (reset khi sort/filter - vô nghĩa)',
            'Không trackBy + 1000 items + array thay đổi = 1000 DOM nodes bị destroy + tạo lại. Với trackBy: chỉ cái thay đổi',
            '@for (Angular 17+) bắt buộc track - không thể quên. Auto-migration: ng generate @angular/core:control-flow',
            '*ngFor + CDK VirtualScroll cho danh sách 10000+ items - chỉ render items trong viewport'
          ]
        },
        {
          title: '*ngSwitch',
          content: `***ngSwitch - multiple conditions (legacy, dùng @switch cho code mới)**

*ngSwitch là kết hợp: [ngSwitch] (attribute) + *ngSwitchCase/*ngSwitchDefault (structural).

**So sánh:**
| | *ngSwitch | @switch |
|--|----------|--------|
| Syntax | 3 directives | **1 block syntax** |
| Type checking | Runtime | **Compile time** |
| Exhaustive | Không | **Có thể** (future) |
| Clean | Phải wrap trong container | **Không cần** |

**@switch là replacement:**
\`@switch (status) { @case ('active') { ... } @case ('inactive') { ... } @default { ... } }\`

Clean hơn và không cần import.`,
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
          content: `**NgModule vs Standalone - hiểu để migrate và maintain**

Standalone là DEFAULT từ Angular 17+. NgModule vẫn supported nhưng là legacy.

**So sánh chi tiết:**
| | NgModule | Standalone |
|--|---------|------------|
| Dependencies | Khai báo ở MODULE | Khai báo ở COMPONENT |
| Tree-shaking | Import module = import tất cả | **Import component = chỉ component đó** |
| Boilerplate | Module + declaration + import | **standalone: true + imports** |
| Self-documenting | Không (phải xem module) | **Có** (component khai báo hết) |
| Lazy loading | loadChildren(→ Module) | **loadComponent(→ Component)** |
| Bootstrap | platformBrowserDynamic() | **bootstrapApplication()** |

**Có thể mix:** Standalone component import vào NgModule và ngược lại - migrate từng bước.

**Migration path:** ng generate @angular/core:standalone - schematic tự động chuyển đổi.`,
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
            'Standalone là DEFAULT từ Angular 17+ - ng generate component tạo standalone mặc định',
            'Mix standalone + NgModule được - migrate từng component, không cần big bang',
            'Standalone component tự document dependencies - nhìn imports là biết cần gì',
            'ng generate @angular/core:standalone - tool tự động migrate (3 modes: convert, remove modules, bootstrap)'
          ]
        },
        {
          title: 'Control Flow: *ngIf vs @if',
          content: `**Control Flow: *ngIf vs @if - chi tiết migration**

Angular 17+ built-in control flow thay thế structural directives.

**Tại sao thay đổi?**
- Structural directives = runtime, cần import, không tree-shakable
- Built-in syntax = compile-time, zero import, tối ưu hơn
- @for với track BắT BUỘC = không còn quên trackBy
- @empty, @else if, @defer = features mới không có trong directives

**Migration guide:**
| Cũ | Mới | Auto-migrate |
|----|------|------------|
| *ngIf="x" | @if (x) { } | ✔ |
| *ngIf="x; else tmpl" | @if (x) { } @else { } | ✔ |
| *ngFor="let i of items; trackBy: fn" | @for (i of items; track i.id) { } | ✔ |
| [ngSwitch]/\*ngSwitchCase | @switch/@case/@default | ✔ |
| Không có | **@defer, @empty** | Mới |

**Tự động migrate:** \`ng generate @angular/core:control-flow\``,
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
            '@for track là BắT BUỘC - compiler error nếu thiếu. @empty block cho empty state. Clean hơn nhiều',
            'ng generate @angular/core:control-flow - schematic tự động chuyển *ngIf → @if, *ngFor → @for',
            '@if (obs$ | async; as data) thay thế *ngIf="obs$ | async as data" - cùng chức năng, syntax mới',
            '@defer không có equivalent trong structural directives - feature hoàn toàn mới'
          ]
        },
        {
          title: 'DI: Constructor vs inject()',
          content: `**Constructor vs inject() - cách inject dependencies**

**inject() (Angular 14+) là RECOMMENDED vì:**
| Ưu điểm | Constructor | inject() |
|---------|------------|----------|
| Functional context | ✘ | ✔ (guards, interceptors, pipes) |
| Inheritance | Phải call super() | Tự do |
| Boilerplate | constructor(private svc: MyService) | private svc = inject(MyService) |
| Tree-shaking | Giống | Giống |
| Optional | @Optional() decorator | { optional: true } option |

**inject() chỉ hoạt động trong INJECTION CONTEXT:**
- Constructor body
- Field initializer
- Factory function (useFactory, InjectionToken factory)
- Functional guard/interceptor/resolver

**KHÔNG hoạt động trong:** ngOnInit, setTimeout callback, subscribe callback, event handlers.

**runInInjectionContext():** Trick để dùng inject() ở nơi khác - cần Injector reference.`,
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
            'inject() CHỈ trong injection context - gọi trong ngOnInit/setTimeout = runtime error!',
            'Functional guard: export const authGuard = () => inject(AuthService).isLoggedIn() - 1 dòng!',
            'inject(DestroyRef) + takeUntilDestroyed() - modern lifecycle management không cần ngOnDestroy',
            'inject() trong field initializer: private http = inject(HttpClient) - gọn hơn constructor injection'
          ]
        },
        {
          title: 'State: RxJS vs Signals',
          content: `**RxJS vs Signals - khi nào dùng cái nào**

**Decision matrix:**
| Scenario | Dùng | Lý do |
|----------|------|-------|
| UI state (toggle, counter) | **Signal** | Sync, simple, auto-CD |
| Form values | **Signal** (hoặc Reactive Forms) | Sync state |
| HTTP requests | **RxJS** | Async, cancel, retry |
| Search autocomplete | **RxJS** | debounce + switchMap |
| WebSocket | **RxJS** | Stream of events |
| Derived display value | **Signal computed()** | Cached, lazy |
| Complex event chains | **RxJS** | Operators ecosystem |
| Route params → data | **RxJS** (hoặc toSignal) | switchMap + async |

**Interop patterns:**
- \`toSignal(obs$)\`: Observable → Signal (cần initialValue!)
- \`toObservable(sig)\`: Signal → Observable (emit async)
- Template: prefer signal() vì không cần async pipe

**Angular's direction:** Signals cho UI/state, RxJS cho async. Cả hai cùng tồn tại.`,
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
            'Signals cho UI state (sync), RxJS cho async operations - không thay thế nhau, bổ sung nhau',
            'toSignal(obs$, { initialValue: [] }) - PHẢI có initialValue vì signal không thể undefined',
            'Template: signal() trực tiếp > obs$ | async - ít pipe, đơn giản, tự track dependencies',
            'Don\'t fight the framework: dùng Signals cho Angular APIs mới (inputs, queries), RxJS cho existing patterns'
          ]
        },
        {
          title: 'Migration Strategy',
          content: `**Migration Strategy - từ legacy đến modern Angular**

**Migration roadmap (thứ tự ưu tiên):**

| Bước | Công việc | Schematic |
|------|-----------|----------|
| 1 | Standalone components | ng g @angular/core:standalone |
| 2 | Built-in control flow | ng g @angular/core:control-flow |
| 3 | inject() thay constructor DI | Manual (refactor) |
| 4 | Signal inputs/outputs | ng g @angular/core:signals |
| 5 | Functional guards/interceptors | Manual |
| 6 | provideRouter/provideHttpClient | Manual |
| 7 | OnPush cho tất cả components | Manual |
| 8 | Zoneless (experimental) | Test để prepare |

**Nguyên tắc:**
- Không cần migrate tất cả cùng lúc - từng bước, từng feature
- Standalone và NgModule có thể tồn tại song song
- Angular CLI schematics tự động hóa nhiều bước
- Test sau mỗi bước migration

**Breaking changes:** Update Angular version trước (ng update), rồi mới migrate patterns.`,
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
            'ng update @angular/core @angular/cli - update version trước, migrate patterns sau',
            'Schematics tự động: standalone, control-flow, signals - chạy và review thay vì làm tay',
            'Test sau MỖI bước migration - không batch nhiều thay đổi rồi mới test',
            'Standalone + NgModule mix được vô hạn - không có deadline phải migrate xong'
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
