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
            code: `{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/my-app",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": ["zone.js"],
            "tsConfig": "tsconfig.app.json",
            "assets": ["src/favicon.ico", "src/assets"],
            "styles": ["src/styles.scss"],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },
                { "type": "anyComponentStyle", "maximumWarning": "4kb" }
              ],
              "outputHashing": "all",
              "optimization": true,
              "sourceMap": false
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          }
        }
      }
    }
  }
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
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error(err));

// app.config.ts - Application configuration
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zone.js config - eventCoalescing giảm CD cycles
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router với features
    provideRouter(routes,
      withViewTransitions(),           // Native View Transitions API
      withComponentInputBinding()      // Route params as @Input()
    ),

    // HttpClient với functional interceptors (Angular 15+)
    provideHttpClient(
      withFetch(),                     // Use fetch API instead of XHR
      withInterceptors([authInterceptor, errorInterceptor])
    ),

    // Lazy load animations
    provideAnimationsAsync()
  ]
};`
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
    ɵɵtext(4, "Click");
    ɵɵelementEnd();
    ɵɵelementEnd();
  }
  if (rf & 2) {  // RenderFlags.Update
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx.title);  // Update text binding
  }
}

// Template instructions = direct DOM manipulation
// Không có Virtual DOM diffing như React`
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

// ❌ BAD: trackBy missing với @for
@for (item of items; track $index) { ... }  // $index = poor tracking

// ✅ GOOD: Track by unique identifier
@for (item of items; track item.id) { ... }

// Event binding - Zone.js integration
// (click)="handler()" triggers:
// 1. Zone.js catches event
// 2. Calls handler()
// 3. Triggers ApplicationRef.tick()
// 4. Runs CD from root

// Escape Zone for performance
constructor(private ngZone: NgZone) {}

heavyComputation() {
  this.ngZone.runOutsideAngular(() => {
    // This won't trigger CD
    requestAnimationFrame(() => this.animate());
  });
}

updateUI() {
  this.ngZone.run(() => {
    // Force CD when needed
    this.result = this.computedValue;
  });
}`
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

  // VIEW QUERIES
  @ViewChild('staticInput', { static: true })
  staticInput!: ElementRef;  // Available in ngOnInit

  @ViewChild('dynamicInput')
  dynamicInput?: ElementRef;  // Only available after ngAfterViewInit, when visible

  @ViewChild(ChildComponent)
  child!: ChildComponent;  // Query by component type

  @ViewChildren(ChildComponent)
  children!: QueryList<ChildComponent>;  // All matching children

  // CONTENT QUERIES - query projected content
  @ContentChild('projectedItem')
  projectedItem?: ElementRef;

  @ContentChildren(SomeDirective)
  projectedDirectives!: QueryList<SomeDirective>;

  ngOnInit() {
    // static: true queries available here
    console.log(this.staticInput.nativeElement);  // ✅ Works
    console.log(this.dynamicInput);  // ❌ undefined
  }

  ngAfterContentInit() {
    // Content queries available here
    console.log(this.projectedItem);
  }

  ngAfterViewInit() {
    // All view queries available here
    console.log(this.dynamicInput);  // ✅ Works (if visible)

    // QueryList is live - updates when DOM changes
    this.children.changes.subscribe(list => {
      console.log('Children changed:', list.length);
    });
  }
}

// Parent using content projection:
// <app-query-demo>
//   <h1 header>This goes to [header] slot</h1>
//   <p #projectedItem>This goes to default slot</p>
// </app-query-demo>`
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
  encapsulation: ViewEncapsulation.Emulated,
  // Change detection strategy
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() primary = false;
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<MouseEvent>();

  onClick(event: MouseEvent) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }
  }
}

// Equivalent using decorators (older style):
@HostBinding('class.btn-primary') get isPrimary() { return this.primary; }
@HostListener('click', ['$event']) onClick(e: MouseEvent) { ... }

// ComponentRef usage (dynamic components):
const componentRef = viewContainerRef.createComponent(ButtonComponent);
componentRef.instance.primary = true;
componentRef.setInput('disabled', false);  // Angular 14+ input setting
componentRef.changeDetectorRef.detectChanges();
componentRef.destroy();`
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

// === SIGNAL-BASED (Angular 17+) ===
@Component({...})
export class ModernComponent {
  // Signal inputs - reactive by default
  value = input<string>();                    // Optional
  id = input.required<number>();              // Required
  disabled = input(false, { transform: booleanAttribute });

  // React to changes - no OnChanges needed!
  constructor() {
    effect(() => {
      console.log('value changed:', this.value());
    });
  }

  // Computed from inputs
  displayValue = computed(() => \`ID: \${this.id()} - \${this.value()}\`);

  // Signal outputs
  valueChange = output<string>();

  // Model input = two-way binding
  // Parent: <app-modern [(count)]="parentCount" />
  count = model(0);

  increment() {
    this.count.update(c => c + 1);  // Auto-emits to parent
  }
}

// Transform functions
function booleanAttribute(value: unknown): boolean {
  return value != null && value !== 'false';
}

// Usage: <app-modern disabled> = true
// Usage: <app-modern [disabled]="false"> = false
// Usage: <app-modern disabled="false"> = false (string transform)`
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
            code: `// === ng-content LIMITATION ===
// Content is ALWAYS rendered, even if not displayed
@Component({
  selector: 'app-lazy-panel',
  template: \`
    @if (expanded) {
      <ng-content></ng-content>  <!-- Still rendered even when collapsed! -->
    }
  \`
})
export class LazyPanel {
  @Input() expanded = false;
}
// <app-lazy-panel [expanded]="false">
//   <heavy-component></heavy-component>  <!-- Rendered anyway! -->
// </app-lazy-panel>

// === ng-template SOLUTION ===
@Component({
  selector: 'app-truly-lazy-panel',
  template: \`
    @if (expanded) {
      <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
    }
  \`
})
export class TrulyLazyPanel {
  @Input() expanded = false;
  @ContentChild(TemplateRef) contentTemplate!: TemplateRef<unknown>;
}
// <app-truly-lazy-panel [expanded]="false">
//   <ng-template>
//     <heavy-component></heavy-component>  <!-- Only rendered when expanded! -->
//   </ng-template>
// </app-truly-lazy-panel>

// === ngTemplateOutlet with CONTEXT ===
@Component({
  selector: 'app-list',
  template: \`
    @for (item of items; track item.id) {
      <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, index: $index }">
      </ng-container>
    }
  \`
})
export class ListComponent<T> {
  @Input() items: T[] = [];
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<{ $implicit: T; index: number }>;
}

// Usage with template context:
// <app-list [items]="users">
//   <ng-template let-user let-i="index">
//     {{ i + 1 }}. {{ user.name }}
//   </ng-template>
// </app-list>

// === MULTIPLE NAMED TEMPLATES ===
@Component({
  selector: 'app-data-table',
  template: \`...complex table...\`
})
export class DataTable {
  @ContentChild('headerTemplate') headerTpl?: TemplateRef<unknown>;
  @ContentChild('rowTemplate') rowTpl!: TemplateRef<unknown>;
  @ContentChild('emptyTemplate') emptyTpl?: TemplateRef<unknown>;
}`
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
} from '@angular/core';

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
}

// Parent component
@Component({
  selector: 'app-parent',
  template: \`
    <!-- ViewChild với element -->
    <input #searchInput type="text">
    <button (click)="focusSearch()">Focus</button>

    <!-- ViewChild với component -->
    <app-item #firstItem name="First"></app-item>

    <!-- ViewChildren với nhiều components -->
    @for (item of items; track item) {
      <app-item [name]="item"></app-item>
    }

    <button (click)="highlightAll()">Highlight All</button>
    <button (click)="addItem()">Add Item</button>
  \`
})
export class ParentComponent implements AfterViewInit {
  items = ['Item 1', 'Item 2', 'Item 3'];

  // ViewChild với ElementRef
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // ViewChild với Component
  @ViewChild('firstItem') firstItem!: ItemComponent;

  // ViewChild static: true - available trong ngOnInit
  @ViewChild('searchInput', { static: true }) searchInputStatic!: ElementRef;

  // ViewChildren - query tất cả instances
  @ViewChildren(ItemComponent) itemComponents!: QueryList<ItemComponent>;

  // ViewChild read option - đọc ElementRef của component
  @ViewChild('firstItem', { read: ElementRef }) firstItemEl!: ElementRef;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    // Access ViewChild/ViewChildren sau khi view init
    console.log('Search input:', this.searchInput.nativeElement);
    console.log('First item:', this.firstItem.name);
    console.log('All items:', this.itemComponents.length);

    // Subscribe to changes
    this.itemComponents.changes.subscribe((items: QueryList<ItemComponent>) => {
      console.log('Items changed:', items.length);
    });
  }

  focusSearch() {
    this.searchInput.nativeElement.focus();
  }

  highlightAll() {
    this.itemComponents.forEach(item => item.highlight());
  }

  addItem() {
    this.items.push(\`Item \${this.items.length + 1}\`);
    // Trigger change detection
    this.cdr.detectChanges();
    // Now itemComponents.changes will emit
  }
}`
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
  @Input() disabled = false;
}

// Tabs container
@Component({
  selector: 'app-tabs',
  standalone: true,
  template: \`
    <div class="tabs">
      <div class="tab-headers">
        @for (tab of tabs; track $index) {
          <button
            [class.active]="activeIndex === $index"
            [disabled]="tab.disabled"
            (click)="selectTab($index)">
            {{ tab.title }}
          </button>
        }
      </div>
      <div class="tab-content">
        @for (tab of tabs; track $index) {
          @if (activeIndex === $index) {
            <ng-container [ngTemplateOutlet]="tabTemplates.toArray()[$index]">
            </ng-container>
          }
        }
      </div>
    </div>
  \`
})
export class TabsComponent implements AfterContentInit {
  activeIndex = 0;

  // Query tất cả Tab components được project
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;

  // Query template refs
  @ContentChildren(TemplateRef) tabTemplates!: QueryList<TemplateRef<any>>;

  ngAfterContentInit() {
    console.log('Number of tabs:', this.tabs.length);

    // Listen for changes (khi tabs được add/remove dynamically)
    this.tabs.changes.subscribe(() => {
      console.log('Tabs changed');
    });
  }

  selectTab(index: number) {
    if (!this.tabs.toArray()[index]?.disabled) {
      this.activeIndex = index;
    }
  }
}

// Sử dụng:
// <app-tabs>
//   <app-tab title="Tab 1">Content 1</app-tab>
//   <app-tab title="Tab 2">Content 2</app-tab>
//   <app-tab title="Tab 3" [disabled]="true">Content 3</app-tab>
// </app-tabs>`
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
  selector: 'app-none',
  encapsulation: ViewEncapsulation.None,
  template: \`<p class="global-text">No encapsulation</p>\`,
  styles: [\`
    /* WARNING: This affects ALL .global-text in the app! */
    .global-text { color: red; font-weight: bold; }
  \`]
})
export class NoneComponent {}

// SHADOW DOM - Native browser encapsulation
@Component({
  selector: 'app-shadow',
  encapsulation: ViewEncapsulation.ShadowDom,
  template: \`
    <p class="text">Shadow DOM encapsulation</p>
    <slot></slot> <!-- ng-content equivalent in Shadow DOM -->
  \`,
  styles: [\`
    .text { color: green; }
    :host { display: block; border: 1px solid gray; }
  \`]
})
export class ShadowComponent {}

// Special selectors
@Component({
  selector: 'app-special',
  template: \`<p>Special selectors demo</p>\`,
  styles: [\`
    /* :host - style the component element itself */
    :host {
      display: block;
      padding: 10px;
    }

    /* :host với condition */
    :host(.active) {
      background: yellow;
    }

    /* :host-context - style dựa trên ancestor */
    :host-context(.dark-theme) {
      background: #333;
      color: white;
    }

    /* ::ng-deep - pierce encapsulation (DEPRECATED but still works) */
    :host ::ng-deep .child-component {
      /* Affects child components - use sparingly! */
      border: 1px solid red;
    }
  \`]
})
export class SpecialSelectorsComponent {}`
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
            code: `import {
  Component, Input, OnInit, OnDestroy, OnChanges, DoCheck,
  AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked,
  SimpleChanges, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-lifecycle-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div>{{ data.name }}</div>
    <ng-content></ng-content>
    <app-child></app-child>
  \`
})
export class LifecycleDemoComponent implements
  OnInit, OnDestroy, OnChanges, DoCheck,
  AfterContentInit, AfterContentChecked,
  AfterViewInit, AfterViewChecked {

  @Input() data!: { name: string };

  private destroy$ = new Subject<void>();

  constructor(private cdr: ChangeDetectorRef) {
    // 1. Constructor - Only DI, no access to inputs yet
    console.log('1. Constructor - data is:', this.data); // undefined
  }

  // 2. ngOnChanges - Called when @Input values change
  ngOnChanges(changes: SimpleChanges) {
    console.log('2. ngOnChanges');
    if (changes['data']) {
      const prev = changes['data'].previousValue;
      const curr = changes['data'].currentValue;
      const first = changes['data'].firstChange;
      console.log(\`  data: \${prev?.name} -> \${curr?.name}, first: \${first}\`);
    }
  }

  // 3. ngOnInit - Component initialized, inputs available
  ngOnInit() {
    console.log('3. ngOnInit - data is:', this.data);

    // Good place to:
    // - Fetch initial data
    // - Setup subscriptions
    // - Initialize complex logic

    this.someService.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // Handle data
      this.cdr.markForCheck(); // Needed for OnPush
    });
  }

  // 4. ngDoCheck - Custom change detection
  ngDoCheck() {
    console.log('4. ngDoCheck');
    // Runs on EVERY change detection cycle
    // Use sparingly - can impact performance
  }

  // 5. ngAfterContentInit - Projected content initialized
  ngAfterContentInit() {
    console.log('5. ngAfterContentInit');
    // ContentChild/ContentChildren available here
  }

  // 6. ngAfterContentChecked - After every content check
  ngAfterContentChecked() {
    console.log('6. ngAfterContentChecked');
  }

  // 7. ngAfterViewInit - View and children initialized
  ngAfterViewInit() {
    console.log('7. ngAfterViewInit');
    // ViewChild/ViewChildren available here
    // DOM manipulation safe here
  }

  // 8. ngAfterViewChecked - After every view check
  ngAfterViewChecked() {
    console.log('8. ngAfterViewChecked');
    // Don't modify state here - causes ExpressionChangedAfterItHasBeenCheckedError
  }

  // 9. ngOnDestroy - Cleanup before destruction
  ngOnDestroy() {
    console.log('9. ngOnDestroy');

    // MUST cleanup:
    this.destroy$.next();
    this.destroy$.complete();

    // Also cleanup:
    // - Remove event listeners
    // - Cancel HTTP requests
    // - Disconnect WebSockets
    // - Clear intervals/timeouts
  }
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
});

// Trong Component
@Component({
  template: \`
    <p>Count: {{ count() }}</p>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">+1</button>
  \`
})
export class CounterComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
  }
}`
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

// When consumer is READ:
// 1. Check if dirty
// 2. If dirty, re-run computation (pull phase)
// 3. Track which signals were read (dependency tracking)
// 4. Return computed value

// === GLITCH-FREE EXAMPLE ===
const a = signal(1);
const b = signal(2);
const sum = computed(() => a() + b());
const product = computed(() => a() * b());
const result = computed(() => sum() + product());

// Without glitch-free: changing a() could cause
// result to see inconsistent sum/product values
// With signals: result always sees consistent state

// Batch updates (implicit in Angular)
a.set(10);
b.set(20);
// result() is computed ONCE with both new values
// Not computed twice with intermediate states`
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
            code: `import { effect, signal, untracked, Injector, inject } from '@angular/core';

// === EFFECT SCHEDULING ===
const count = signal(0);

effect(() => {
  console.log('Effect runs:', count());
});

count.set(1);
count.set(2);
count.set(3);
// Output: "Effect runs: 3" (once, not 3 times!)
// Effect batched, runs once with final value

// === CLEANUP FUNCTION ===
effect((onCleanup) => {
  const subscription = someObservable$.subscribe(data => {
    // handle data
  });

  // Cleanup runs BEFORE next effect execution
  onCleanup(() => {
    subscription.unsubscribe();
  });
});

// === UNTRACKED READS ===
const user = signal({ name: 'John' });
const logCount = signal(0);

effect(() => {
  // This tracks user changes
  console.log('User:', user().name);

  // This does NOT track logCount - won't re-run when logCount changes
  console.log('Log count:', untracked(() => logCount()));
});

// === EFFECT OUTSIDE INJECTION CONTEXT ===
// Effects need DestroyRef for cleanup
// Inside component/service: automatic
// Outside: manual

class NonAngularClass {
  private injector = inject(Injector);

  setupEffect() {
    effect(() => {
      // Effect code
    }, { injector: this.injector });
  }
}

// === EFFECT OPTIONS ===
effect(() => { ... }, {
  allowSignalWrites: true,  // Allow set() inside effect (use carefully!)
  injector: someInjector,   // Manual injector
  manualCleanup: true,      // Don't auto-cleanup on destroy
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
            code: `import { signal, computed, effect } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { BehaviorSubject, switchMap, debounceTime, distinctUntilChanged } from 'rxjs';

// === SIGNAL FOR UI STATE ===
@Component({...})
class SearchComponent {
  query = signal('');
  results = signal<Item[]>([]);
  loading = signal(false);

  // Computed for derived state
  hasResults = computed(() => this.results().length > 0);
  resultCount = computed(() => this.results().length);
}

// === OBSERVABLE FOR ASYNC FLOWS ===
// Signal can't do debounce, switchMap, etc.
@Component({...})
class SearchWithDebounce {
  private searchQuery$ = new BehaviorSubject('');

  results$ = this.searchQuery$.pipe(
    debounceTime(300),           // Wait 300ms
    distinctUntilChanged(),      // Skip if same
    switchMap(q => this.api.search(q))  // Cancel previous
  );

  // Convert to signal for template
  results = toSignal(this.results$, { initialValue: [] });
}

// === INTEROP PATTERNS ===
// HTTP to Signal (common pattern)
@Injectable()
class UserService {
  private http = inject(HttpClient);

  getUser(id: number) {
    // Returns Signal<User | undefined>
    return toSignal(this.http.get<User>(\`/api/users/\${id}\`));
  }
}

// Signal to Observable (for operators)
const searchSignal = signal('');
const debouncedSearch$ = toObservable(searchSignal).pipe(
  debounceTime(300),
  distinctUntilChanged()
);

// === GOTCHA: toSignal requireSync ===
// This throws if observable hasn't emitted!
const value = toSignal(observable$, { requireSync: true });

// This is safe - provides initial value
const value = toSignal(observable$, { initialValue: null });`
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
  user = input.required<{ name: string; email: string }>();

  // Optional input với default value
  showEmail = input(true);

  // Optional input, type inferred
  featured = input(false);

  // Input với alias
  age = input(0, { alias: 'userAge' });

  // Input với transform function
  name = input('', {
    transform: (value: string) => value.trim().toUpperCase()
  });

  // Computed từ input signals
  displayName = computed(() => {
    const user = this.user();
    return \`\${user.name} (\${this.age()} tuổi)\`;
  });
}

// Parent component usage:
// <app-user-card
//   [user]="{ name: 'John', email: 'john@example.com' }"
//   [showEmail]="false"
//   [userAge]="25"
//   [featured]="true"
// />

// Transform examples
@Component({ ... })
export class TransformExamples {
  // Boolean coercion
  disabled = input(false, {
    transform: (value: boolean | string) => value === '' || value === true
  });

  // Number coercion
  count = input(0, {
    transform: (value: number | string) => Number(value)
  });

  // Built-in transforms (Angular 17.2+)
  // import { booleanAttribute, numberAttribute } from '@angular/core';
  // isActive = input(false, { transform: booleanAttribute });
  // size = input(0, { transform: numberAttribute });
}`
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
import { interval, map } from 'rxjs';

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

  // Output với alias
  resetted = output({ alias: 'onReset' });

  // Output từ Observable
  tick = outputFromObservable(
    interval(1000).pipe(map(n => n + 1))
  );

  increment() {
    this.count++;
    this.countChange.emit(this.count);
  }

  decrement() {
    this.count--;
    this.countChange.emit(this.count);
  }

  reset() {
    this.count = 0;
    this.countChange.emit(this.count);
    this.resetted.emit(); // Emit without value
  }
}

// Parent usage:
// <app-counter
//   (countChange)="onCountChange($event)"
//   (onReset)="onCounterReset()"
//   (tick)="onTick($event)"
// />

// So sánh cũ vs mới
@Component({ ... })
export class ComparisonComponent {
  // CŨ: @Output() với EventEmitter
  // @Output() saved = new EventEmitter<User>();
  // this.saved.emit(user);

  // MỚI: output()
  saved = output<User>();
  // this.saved.emit(user);
}`
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
  // Tạo: [checked] input và (checkedChange) output
  checked = model(false);

  // model.required() cho required two-way binding
  // value = model.required<string>();

  toggle() {
    // model là writable signal - có thể set()
    this.checked.set(!this.checked());
    // Tự động emit (checkedChange) event
  }
}

// Parent component
@Component({
  selector: 'app-parent',
  template: \`
    <h3>Notifications: {{ notificationsEnabled() ? 'ON' : 'OFF' }}</h3>

    <!-- Two-way binding với banana-in-a-box -->
    <app-toggle [(checked)]="notificationsEnabled" />

    <!-- Hoặc expanded form -->
    <app-toggle
      [checked]="darkMode()"
      (checkedChange)="darkMode.set($event)"
    />

    <!-- model.required example -->
    <app-input [(value)]="username" />
  \`
})
export class ParentComponent {
  notificationsEnabled = signal(true);
  darkMode = signal(false);
  username = signal('');
}

// Custom input component
@Component({
  selector: 'app-input',
  template: \`
    <input
      [value]="value()"
      (input)="onInput($event)"
      (blur)="onBlur()"
    >
    @if (touched() && !value()) {
      <span class="error">Required</span>
    }
  \`
})
export class InputComponent {
  value = model.required<string>();
  touched = signal(false);

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value.set(input.value);
  }

  onBlur() {
    this.touched.set(true);
  }
}`
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
  readonly filteredTodos = computed(() => {
    const todos = this._todos();
    const filter = this._filter();

    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  });

  readonly stats = computed(() => ({
    total: this._todos().length,
    active: this._todos().filter(t => !t.completed).length,
    completed: this._todos().filter(t => t.completed).length
  }));

  // Actions
  addTodo(title: string) {
    this._todos.update(todos => [...todos, {
      id: Date.now(),
      title,
      completed: false
    }]);
  }

  toggleTodo(id: number) {
    this._todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }

  setFilter(filter: 'all' | 'active' | 'completed') {
    this._filter.set(filter);
  }

  async loadTodos() {
    this._loading.set(true);
    try {
      const todos = await this.api.getTodos();
      this._todos.set(todos);
    } finally {
      this._loading.set(false);
    }
  }
}

// Pattern 2: Effect with cleanup
@Component({ ... })
export class EffectComponent {
  searchTerm = signal('');

  constructor() {
    // Effect với cleanup function
    effect((onCleanup) => {
      const term = this.searchTerm();
      if (!term) return;

      const controller = new AbortController();

      fetch(\`/api/search?q=\${term}\`, { signal: controller.signal })
        .then(res => res.json())
        .then(data => console.log(data));

      // Cleanup khi effect re-runs hoặc component destroys
      onCleanup(() => {
        controller.abort();
      });
    });
  }
}

// Pattern 3: untracked() để tránh tracking
@Component({ ... })
export class UntrackedExample {
  count = signal(0);
  name = signal('John');

  constructor() {
    effect(() => {
      // Chỉ track count, không track name
      console.log('Count:', this.count());
      console.log('Name:', untracked(() => this.name()));
    });
  }
}

// Pattern 4: LinkedSignal (Angular 19+)
// import { linkedSignal } from '@angular/core';
// const source = signal({ items: ['a', 'b', 'c'] });
// const selectedIndex = linkedSignal(() => source().items.length - 1);
// Khi source thay đổi, selectedIndex tự động reset`
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

<!-- @switch - thay thế *ngSwitch -->
@switch (status) {
  @case ('active') {
    <span class="badge green">Active</span>
  }
  @case ('pending') {
    <span class="badge yellow">Pending</span>
  }
  @default {
    <span class="badge gray">Unknown</span>
  }
}`
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

<!-- Defer triggers -->
@defer (on idle) { }      <!-- Khi browser idle -->
@defer (on viewport) { }  <!-- Khi element vào viewport -->
@defer (on interaction) { }  <!-- Khi user interact -->
@defer (on hover) { }     <!-- Khi hover -->
@defer (on timer(2s)) { } <!-- Sau 2 giây -->
@defer (when condition) { } <!-- Khi condition = true -->`
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
    } else {
      this.vcRef.clear();
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private vcRef: ViewContainerRef
  ) {}
}

// Attribute Directive
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }

  constructor(private el: ElementRef) {}
}`
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
  }
}

// 2. Inject vào Component
@Component({...})
export class UserListComponent {
  // Cách 1: Constructor injection
  constructor(private userService: UserService) {}

  // Cách 2: inject() function (khuyên dùng)
  private userService = inject(UserService);

  users = this.userService.users$;
}

// 3. Các scope khác nhau
@Injectable({ providedIn: 'root' })  // Singleton toàn app

@Component({
  providers: [LocalService]  // Instance mới cho mỗi component
})
export class MyComponent {}`
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
function resolve(token: ProviderToken, flags: InjectFlags) {
  // 1. Start from current element injector
  let injector = currentElementInjector;

  // 2. Walk up element injector tree
  while (injector) {
    const value = injector.get(token, NOT_FOUND);
    if (value !== NOT_FOUND) return value;

    if (flags & InjectFlags.Self) break;  // Stop at current
    if (flags & InjectFlags.Host) {
      // Stop at host component boundary
      if (injector.isHost) break;
    }

    injector = injector.parent;
  }

  // 3. Check environment injector (if not SkipSelf)
  if (!(flags & InjectFlags.SkipSelf)) {
    const envInjector = getEnvironmentInjector();
    const value = envInjector.get(token, NOT_FOUND);
    if (value !== NOT_FOUND) return value;
  }

  // 4. Not found
  if (flags & InjectFlags.Optional) return null;
  throw new Error(\`No provider for \${token}\`);
}

// Injection flags
inject(Token, { optional: true });  // Return null if not found
inject(Token, { self: true });      // Only check current injector
inject(Token, { skipSelf: true });  // Skip current, start from parent
inject(Token, { host: true });      // Stop at host boundary`
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

  // 2. useValue - use existing value
  { provide: API_URL, useValue: 'https://api.example.com' },
  { provide: CONFIG, useValue: { apiUrl: '/api', debug: true } },

  // 3. useFactory - call factory function
  {
    provide: DataService,
    useFactory: (http: HttpClient, config: AppConfig) => {
      return config.debug
        ? new MockDataService()
        : new RealDataService(http);
    },
    deps: [HttpClient, CONFIG]  // Factory dependencies
  },

  // 4. useExisting - alias to another token
  { provide: AbstractLogger, useExisting: FileLogger },
];

// === ADVANCED: Multi Providers ===
// Collect multiple values under one token
const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptor[]>('interceptors');

providers: [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true },
]

// inject() returns array: [AuthInterceptor, LoggingInterceptor]
const interceptors = inject(HTTP_INTERCEPTORS);

// === TREE-SHAKABLE PROVIDERS ===
// providedIn: 'root' = service removed if not injected anywhere
@Injectable({
  providedIn: 'root',          // App-wide singleton
  // OR
  providedIn: 'platform',      // Shared across apps
  // OR
  providedIn: SomeModule,      // Module-scoped
})
export class MyService {}`
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
  }

  // forChild = no providers, just re-exports
  static forChild(): ModuleWithProviders<ToastModule> {
    return {
      ngModule: ToastModule,
      providers: []  // No services!
    };
  }
}

// Usage:
// AppModule: imports: [ToastModule.forRoot({ duration: 3000 })]
// FeatureModule: imports: [ToastModule.forChild()]

// === MODERN STANDALONE EQUIVALENT ===
// No need for forRoot/forChild with providedIn: 'root'
@Injectable({ providedIn: 'root' })
export class ToastService {
  private config = inject(TOAST_CONFIG, { optional: true }) ?? defaultConfig;
}

// Provide config at app level:
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: TOAST_CONFIG, useValue: { duration: 3000 } }
  ]
};

// === ENVIRONMENT INJECTOR FOR LAZY MODULES ===
// Each lazy route gets its own environment injector
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component'),
    providers: [
      // These services are scoped to /admin route subtree
      AdminService,
      { provide: API_URL, useValue: '/admin-api' }
    ]
  }
];`
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
} from '@angular/core';

@Component({ ... })
export class LifecycleComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() data!: string;

  // 1. Constructor - DI, không access DOM
  constructor() {
    console.log('1. Constructor');
  }

  // 2. ngOnChanges - Khi @Input thay đổi
  ngOnChanges(changes: SimpleChanges) {
    console.log('2. ngOnChanges', changes);
    if (changes['data']) {
      console.log('data changed:', changes['data'].currentValue);
    }
  }

  // 3. ngOnInit - Khởi tạo component (1 lần)
  ngOnInit() {
    console.log('3. ngOnInit');
    // Fetch data, setup subscriptions
  }

  // 4. ngAfterViewInit - Sau khi view được render
  ngAfterViewInit() {
    console.log('4. ngAfterViewInit');
    // Access ViewChild, DOM elements
  }

  // 5. ngOnDestroy - Cleanup trước khi destroy
  ngOnDestroy() {
    console.log('5. ngOnDestroy');
    // Unsubscribe, remove listeners
  }
}`
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
import { map, filter, switchMap, debounceTime } from 'rxjs/operators';

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

// Operators - transform streams
numbers$.pipe(
  filter(n => n % 2 === 0),     // Lọc số chẵn
  map(n => n * 10)              // Nhân 10
).subscribe(console.log);       // 20, 40

// HTTP với RxJS
searchInput$.pipe(
  debounceTime(300),            // Đợi 300ms
  distinctUntilChanged(),       // Skip nếu giống
  switchMap(term =>             // Cancel request cũ
    http.get(\`/api/search?q=\${term}\`)
  )
).subscribe(results => {
  // Handle results
});`
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
  console.log('Subscribed!');

  subscriber.next(1);
  subscriber.next(2);
  subscriber.next(3);
  subscriber.complete();

  // Return cleanup function
  return () => console.log('Cleaned up!');
});

// Nothing logged yet - Observable is lazy
// ...

myObservable$.subscribe(console.log);
// NOW logs: "Subscribed!", 1, 2, 3
// On unsubscribe/complete: "Cleaned up!"

// === COLD vs HOT ===
// COLD: Each subscriber gets own execution
const cold$ = interval(1000);  // Each subscriber starts from 0

// HOT: All subscribers share execution
const hot$ = cold$.pipe(share());  // All see same values

// Subject = Hot Observable + Observer
const subject = new Subject<number>();
subject.subscribe(v => console.log('A:', v));
subject.subscribe(v => console.log('B:', v));
subject.next(1);  // A: 1, B: 1 (both see same value)`
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
  mergeMap(() => http.get('/api/data'))
).subscribe();
// Click1 → Request1 starts
// Click2 → Request2 starts (Request1 still running)
// Result: Both results received (order not guaranteed)

// === concatMap ===
// Queue requests, run one at a time
// USE: Order-dependent operations, sequential processing
clicks$.pipe(
  concatMap(() => http.get('/api/data'))
).subscribe();
// Click1 → Request1 starts
// Click2 → Queued (wait for Request1)
// Request1 complete → Request2 starts
// Result: Both results, guaranteed order

// === exhaustMap ===
// Ignore new clicks while request in progress
// USE: Prevent double-submit, login buttons
clicks$.pipe(
  exhaustMap(() => http.post('/api/submit', data))
).subscribe();
// Click1 → Request1 starts
// Click2 → IGNORED (Request1 still running)
// Request1 complete → Ready for new click
// Result: Only Request1 result

// === VISUALIZATION ===
// Input:  --1----2--3--------4-->
// switchMap:  --a]--b]--c--------d-->   (] = cancelled)
// mergeMap:   --a---ab--abc------abcd-->
// concatMap:  --a------b--c------d-->   (queued)
// exhaustMap: --a------b---------c-->   (2,3 ignored while a running)`
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

// === retry ===
// Resubscribe N times on error
http.get('/api/data').pipe(
  retry(3)  // Try up to 4 times total
);

// === retryWhen (deprecated) → retry with config ===
http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => {
      // Exponential backoff
      const delayMs = Math.pow(2, retryCount) * 1000;
      console.log(\`Retry \${retryCount} in \${delayMs}ms\`);
      return timer(delayMs);
    },
    resetOnSuccess: true
  })
);

// === Error handling at subscription ===
observable$.subscribe({
  next: value => console.log(value),
  error: err => {
    // This is called ONCE, then stream is dead
    console.error('Stream died:', err);
    // You might want to restart or show error UI
  },
  complete: () => console.log('Completed normally')
});

// === Keep stream alive with inner catchError ===
source$.pipe(
  mergeMap(item =>
    processItem(item).pipe(
      catchError(err => {
        console.error('Item failed:', item, err);
        return EMPTY;  // Skip this item, continue with others
      })
    )
  )
);`
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
export class UserListComponent {
  users$ = this.http.get<User[]>('/api/users');
  user$ = this.userService.currentUser$;

  constructor(
    private http: HttpClient,
    private userService: UserService
  ) {}
  // Không cần ngOnDestroy để unsubscribe!
}`
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
import { fromEvent, interval } from 'rxjs';

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
  // Tất cả uploads chạy đồng thời (tối đa 3)
  // Không có request nào bị cancel
);

// === concatMap ===
// Use case: Sequential API calls - đảm bảo thứ tự
saveButtons$.pipe(
  concatMap(data => this.saveService.save(data))
  // Request 2 chỉ bắt đầu sau khi request 1 complete
  // Đảm bảo thứ tự chính xác
);

// === exhaustMap ===
// Use case: Submit button - ignore clicks khi đang submit
submitButton$.pipe(
  exhaustMap(() => this.submitForm())
  // Nếu user click nhiều lần khi đang submit
  // Các clicks sau đều bị IGNORE cho đến khi submit xong
);

// Visual comparison:
// Time:     0---1---2---3---4---5---6
// Source:   A-------B-------C-------
// Inner:    --x--y--|
//
// switchMap: --x--y----x--y----x--y--| (cancel & restart)
// mergeMap:  --x--y----x--y----x--y--| (run parallel)
// concatMap: --x--y------x--y----x--y| (run sequential)
// exhaustMap:--x--y--------x--y------| (ignore during active)`
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
} from 'rxjs';

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
  }))
);

// === forkJoin ===
// Use case: Load multiple APIs parallel, wait for ALL
const initialData$ = forkJoin({
  users: this.userService.getAll(),
  products: this.productService.getAll(),
  config: this.configService.load()
}).pipe(
  map(({ users, products, config }) => {
    // All data available here
    return { users, products, config };
  })
);
// CHÚ Ý: Nếu bất kỳ Observable nào error, forkJoin sẽ error

// === merge ===
// Use case: Combine multiple event sources
const allClicks$ = merge(
  fromEvent(button1, 'click').pipe(map(() => 'btn1')),
  fromEvent(button2, 'click').pipe(map(() => 'btn2')),
  fromEvent(button3, 'click').pipe(map(() => 'btn3'))
);

// === zip ===
// Use case: Pair requests (hiếm khi dùng)
const paired$ = zip(
  this.http.get('/api/users'),
  this.http.get('/api/roles')
).pipe(
  map(([users, roles]) => this.combineUsersAndRoles(users, roles))
);

// === withLatestFrom ===
// Use case: Lấy current state khi action xảy ra
this.saveClicks$.pipe(
  withLatestFrom(this.form.valueChanges),
  map(([_, formValue]) => formValue),
  switchMap(value => this.saveService.save(value))
);

// === startWith ===
// Use case: Provide initial value
this.users$ = this.userService.getUsers().pipe(
  startWith([]) // Emit [] ngay lập tức, sau đó emit actual data
);

// === concat ===
// Use case: Sequential operations
const loadSequence$ = concat(
  this.loadConfig(),
  this.loadUser(),
  this.loadData()
); // Chạy tuần tự, không parallel`
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
} from 'rxjs';
import { delay, take, tap } from 'rxjs/operators';

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
);

// === retry ===
// Retry 3 lần trước khi fail
this.http.get('/api/data').pipe(
  retry(3),
  catchError(error => {
    console.error('Failed after 3 retries');
    return of(null);
  })
);

// === retry với delay ===
this.http.get('/api/data').pipe(
  retry({
    count: 3,
    delay: (error, retryCount) => {
      console.log(\`Retry \${retryCount} after error:\`, error);
      return timer(retryCount * 1000); // Exponential backoff
    }
  })
);

// === finalize ===
// Luôn chạy dù success hay error
this.loading = true;
this.http.get('/api/data').pipe(
  finalize(() => {
    this.loading = false; // Luôn chạy
  })
).subscribe({
  next: data => this.data = data,
  error: err => this.error = err
});

// === Complete error handling pattern ===
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getData<T>(url: string): Observable<T> {
    return this.http.get<T>(url).pipe(
      retry({
        count: 2,
        delay: (error, retryCount) => {
          // Chỉ retry cho network errors
          if (error.status === 0 || error.status >= 500) {
            return timer(1000 * retryCount);
          }
          return throwError(() => error);
        }
      }),
      catchError(error => {
        // Log và transform error
        console.error(\`API Error [\${url}]:\`, error);

        if (error.status === 401) {
          this.authService.logout();
        }

        return throwError(() => ({
          message: this.getErrorMessage(error),
          status: error.status,
          original: error
        }));
      })
    );
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) return 'Network error';
    if (error.status === 404) return 'Not found';
    if (error.status >= 500) return 'Server error';
    return error.error?.message || 'Unknown error';
  }
}`
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

behavior$.subscribe(x => console.log('A:', x)); // A: initial
behavior$.next('updated'); // A: updated

behavior$.subscribe(x => console.log('B:', x)); // B: updated (nhận latest ngay)
behavior$.next('latest'); // A: latest, B: latest

// Đọc current value synchronously
console.log(behavior$.getValue()); // 'latest'

// === ReplaySubject ===
// Replay N giá trị cuối cho new subscribers
const replay$ = new ReplaySubject<number>(2); // Buffer 2 values

replay$.next(1);
replay$.next(2);
replay$.next(3);

replay$.subscribe(x => console.log('A:', x)); // A: 2, A: 3 (nhận 2 giá trị cuối)
replay$.next(4); // A: 4

// ReplaySubject với time window
const replayTime$ = new ReplaySubject<number>(100, 500); // 100 values, 500ms

// === AsyncSubject ===
// Chỉ emit giá trị cuối cùng khi complete
const async$ = new AsyncSubject<number>();

async$.subscribe(x => console.log('A:', x));
async$.next(1); // Không emit
async$.next(2); // Không emit
async$.next(3); // Không emit
async$.complete(); // A: 3 (chỉ emit cuối cùng)

// === Practical Examples ===
@Injectable({ providedIn: 'root' })
export class UserService {
  // BehaviorSubject cho current user state
  private currentUser$ = new BehaviorSubject<User | null>(null);
  readonly user$ = this.currentUser$.asObservable();

  login(credentials: Credentials): Observable<User> {
    return this.http.post<User>('/api/login', credentials).pipe(
      tap(user => this.currentUser$.next(user))
    );
  }

  logout() {
    this.currentUser$.next(null);
  }

  get isLoggedIn(): boolean {
    return this.currentUser$.getValue() !== null;
  }
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  // Subject cho fire-and-forget notifications
  private notifications$ = new Subject<Notification>();
  readonly notification$ = this.notifications$.asObservable();

  show(message: string, type: 'success' | 'error' = 'success') {
    this.notifications$.next({ message, type, id: Date.now() });
  }
}`
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
import { DestroyRef, inject } from '@angular/core';

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
// GOOD: Explicit cleanup
@Component({ ... })
export class TraditionalComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.dataService.getData().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => this.data = data);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// === Pattern 3: shareReplay for caching ===
@Injectable({ providedIn: 'root' })
export class CachedService {
  private http = inject(HttpClient);

  // Cache và share result
  readonly config$ = this.http.get('/api/config').pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // refCount: true = unsubscribe khi không còn subscribers
}

// === Pattern 4: Declarative streams ===
@Component({ ... })
export class DeclarativeComponent {
  private searchTerm = new BehaviorSubject<string>('');
  private page = new BehaviorSubject<number>(1);

  // Combine sources declaratively
  readonly users$ = combineLatest([
    this.searchTerm.pipe(debounceTime(300), distinctUntilChanged()),
    this.page
  ]).pipe(
    switchMap(([term, page]) =>
      this.userService.search(term, page)
    ),
    shareReplay(1)
  );

  // Loading state
  readonly loading$ = this.users$.pipe(
    map(() => false),
    startWith(true)
  );

  // Actions
  search(term: string) {
    this.searchTerm.next(term);
  }

  goToPage(page: number) {
    this.page.next(page);
  }
}

// === Pattern 5: Error boundary ===
@Injectable({ providedIn: 'root' })
export class SafeService {
  getData(): Observable<Data> {
    return this.http.get<Data>('/api/data').pipe(
      catchError(error => {
        this.errorService.handle(error);
        return EMPTY; // Don't break the stream
      })
    );
  }
}

// === AntiPatterns to AVOID ===
// ❌ BAD: Nested subscribes
this.user$.subscribe(user => {
  this.orders$.subscribe(orders => { ... }); // Memory leak!
});

// ✅ GOOD: Use operators
this.user$.pipe(
  switchMap(user => this.orderService.getOrders(user.id))
).subscribe(orders => { ... });

// ❌ BAD: Subscribe without unsubscribe
ngOnInit() {
  this.data$.subscribe(data => { ... }); // Memory leak!
}

// ✅ GOOD: Always cleanup
ngOnInit() {
  this.data$.pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(data => { ... });
}

// ❌ BAD: Storing subscription array
subscriptions: Subscription[] = [];
ngOnDestroy() {
  this.subscriptions.forEach(s => s.unsubscribe()); // Verbose
}

// ✅ GOOD: Use Subject or takeUntilDestroyed
// Much cleaner and less error-prone`
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

// REACTIVE FORMS (cần ReactiveFormsModule)
@Component({
  imports: [ReactiveFormsModule],
  template: \`
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email">
      <button [disabled]="form.invalid">Submit</button>
    </form>
  \`
})
export class ReactiveFormComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  onSubmit() { console.log(this.form.value); }
}`
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

  get phones() {
    return this.form.get('phones') as FormArray;
  }

  addPhone() {
    this.phones.push(this.fb.control('', Validators.required));
  }

  removePhone(index: number) {
    this.phones.removeAt(index);
  }

  // Access form state
  checkValidity() {
    console.log('Valid:', this.form.valid);
    console.log('Dirty:', this.form.dirty);
    console.log('Touched:', this.form.touched);
    console.log('Errors:', this.form.get('email')?.errors);
  }
}`
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
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecial = /[!@#$%^&*]/.test(value);
    const minLength = value.length >= 8;

    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecial && minLength;

    return !valid ? {
      passwordStrength: {
        hasUpperCase, hasLowerCase, hasNumber, hasSpecial, minLength
      }
    } : null;
  };
}

// Match validator (confirm password)
export function matchValidator(controlName: string, matchingControlName: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (control?.value !== matchingControl?.value) {
      matchingControl?.setErrors({ mustMatch: true });
      return { mustMatch: true };
    } else {
      matchingControl?.setErrors(null);
      return null;
    }
  };
}

// Sử dụng
this.form = this.fb.group({
  username: ['', [Validators.required, forbiddenNameValidator('admin')]],
  password: ['', [Validators.required, passwordStrengthValidator()]],
  confirmPassword: ['', Validators.required]
}, {
  validators: matchValidator('password', 'confirmPassword')
});`
          }
        },
        {
          title: 'Async Validators',
          content: `Async validators dùng cho validation cần gọi API (check email tồn tại, validate username...).`,
          code: {
            language: 'typescript',
            filename: 'async-validators.ts',
            code: `import { AsyncValidatorFn } from '@angular/forms';
import { map, catchError, debounceTime, switchMap, first } from 'rxjs/operators';
import { of, timer } from 'rxjs';

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
export function createUniqueEmailValidator(): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const userService = inject(UserService);

    return control.valueChanges.pipe(
      debounceTime(300),
      switchMap(email => userService.checkEmailExists(email)),
      map(exists => exists ? { emailTaken: true } : null),
      first()
    );
  };
}

// Sử dụng trong component
@Component({ ... })
export class RegisterComponent {
  private userService = inject(UserService);

  form = this.fb.group({
    username: ['',
      [Validators.required, Validators.minLength(3)],
      [uniqueUsernameValidator(this.userService)] // Async validator
    ],
    email: ['',
      [Validators.required, Validators.email],
      [this.emailValidator()]
    ]
  });

  private emailValidator(): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return this.userService.checkEmailExists(control.value).pipe(
        map(exists => exists ? { emailTaken: true } : null)
      );
    };
  }
}`
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
            }
            @if (form.get('email')?.hasError('emailTaken')) {
              <span>Email đã được sử dụng</span>
            }
          </div>
        }

        <!-- Pending state cho async validation -->
        @if (form.get('email')?.pending) {
          <span class="checking">Đang kiểm tra...</span>
        }
      </div>

      <div class="field">
        <label>Password</label>
        <input type="password" formControlName="password">

        @if (form.get('password')?.hasError('passwordStrength'); as error) {
          <div class="password-requirements">
            <span [class.valid]="error.hasUpperCase">✓ Chữ hoa</span>
            <span [class.valid]="error.hasLowerCase">✓ Chữ thường</span>
            <span [class.valid]="error.hasNumber">✓ Số</span>
            <span [class.valid]="error.hasSpecial">✓ Ký tự đặc biệt</span>
            <span [class.valid]="error.minLength">✓ Ít nhất 8 ký tự</span>
          </div>
        }
      </div>

      <button type="submit" [disabled]="form.invalid || form.pending">
        {{ form.pending ? 'Đang xử lý...' : 'Đăng ký' }}
      </button>
    </form>
  \`
})
export class RegisterFormComponent {
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrengthValidator()]]
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    } else {
      // Mark all fields as touched để hiển thị errors
      this.form.markAllAsTouched();
    }
  }
}`
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
const form = new FormGroup<UserForm>({
  name: new FormControl('', { nonNullable: true }),
  email: new FormControl('', { nonNullable: true }),
  age: new FormControl<number | null>(null),
  addresses: new FormArray<FormGroup<AddressForm>>([])
});

// Type-safe access
form.value.name;        // string | undefined
form.controls.name.value;  // string (nonNullable)
form.getRawValue().name;   // string (bao gồm disabled controls)

// nonNullable: true - không cho phép null
// Khi reset, sẽ reset về initial value thay vì null
form.controls.name.reset(); // '' không phải null

// FormBuilder với typed forms
@Component({ ... })
export class TypedFormComponent {
  private fb = inject(NonNullableFormBuilder);

  // Tất cả controls mặc định nonNullable
  form = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    settings: this.fb.group({
      newsletter: [false],
      notifications: [true]
    })
  });

  // Type inference
  onSubmit() {
    const value = this.form.getRawValue();
    // value.name là string, không phải string | null
    console.log(value.name.toUpperCase()); // Type-safe!
  }
}`
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

  // Lấy route params
  ngOnInit() {
    // Snapshot - giá trị tại thời điểm hiện tại
    const id = this.route.snapshot.params['id'];

    // Observable - khi params thay đổi
    this.route.params.subscribe(params => {
      console.log('ID:', params['id']);
    });

    // Query params: /users?page=1&sort=name
    this.route.queryParams.subscribe(query => {
      console.log('Page:', query['page']);
    });
  }
}`
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

// dashboard/dashboard.routes.ts
export const DASHBOARD_ROUTES: Routes = [
  { path: '', component: DashboardHomeComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'settings', component: SettingsComponent }
];`
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
import { inject } from '@angular/core';

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
  (component) => {
    if (component.hasUnsavedChanges()) {
      return confirm('Discard unsaved changes?');
    }
    return true;
  };

// Sử dụng trong routes
export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  },
  {
    path: 'edit',
    component: FormComponent,
    canDeactivate: [unsavedChangesGuard]
  }
];`
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

  // GET với query params
  searchUsers(query: string, page: number): Observable<User[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('page', page.toString());

    return this.http.get<User[]>(this.apiUrl, { params });
  }

  // POST - Tạo mới
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  // PUT - Update toàn bộ
  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(\`\${this.apiUrl}/\${id}\`, user);
  }

  // PATCH - Update một phần
  patchUser(id: number, changes: Partial<User>): Observable<User> {
    return this.http.patch<User>(\`\${this.apiUrl}/\${id}\`, changes);
  }

  // DELETE
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/\${id}\`);
  }
}`
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
    observe: 'response' // Để lấy full response với headers
  }).pipe(
    map(response => {
      const filename = response.headers.get('Content-Disposition');
      return response.body!;
    })
  );
}

// Upload file với progress
uploadFile(file: File): Observable<number> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post('/api/upload', formData, {
    reportProgress: true,
    observe: 'events'
  }).pipe(
    filter(event => event.type === HttpEventType.UploadProgress),
    map(event => Math.round(100 * event.loaded / event.total!))
  );
}`
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
import { HttpErrorResponse } from '@angular/common/http';

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

    if (error.status === 0) {
      // Network error
      errorMessage = 'Không thể kết nối server';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized - vui lòng đăng nhập lại';
    } else if (error.status === 403) {
      errorMessage = 'Forbidden - không có quyền truy cập';
    } else if (error.status === 404) {
      errorMessage = 'Không tìm thấy resource';
    } else if (error.status >= 500) {
      errorMessage = 'Server error - vui lòng thử lại sau';
    } else {
      errorMessage = error.error?.message || error.message;
    }

    console.error('HTTP Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}

// Trong component
this.userService.getUsers().subscribe({
  next: (users) => this.users = users,
  error: (err) => this.errorMessage = err.message
});`
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

// Logging Interceptor
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  const started = Date.now();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - started;
          console.log(\`\${req.method} \${req.url} - \${elapsed}ms\`);
        }
      },
      error: (error) => {
        console.error(\`\${req.method} \${req.url} - Error:\`, error);
      }
    })
  );
};

// Error handling Interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Redirect to login
        inject(Router).navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

// Đăng ký trong app.config.ts
provideHttpClient(
  withInterceptors([authInterceptor, loggingInterceptor, errorInterceptor])
)`
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
      this.cache$.set(cacheKey, request$);
    }

    return this.cache$.get(cacheKey)!;
  }

  // Invalidate cache
  refreshUsers(): void {
    this.cache$.delete('users');
  }

  // Auto-refresh cache
  getUsersWithRefresh(): Observable<User[]> {
    return this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.http.get<User[]>('/api/users')),
      shareReplay(1)
    );
  }

  triggerRefresh(): void {
    this.refresh$.next();
  }
}

// Debounce search input
searchUsers(searchTerm$: Observable<string>): Observable<User[]> {
  return searchTerm$.pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    switchMap(term => this.http.get<User[]>(\`/api/users?q=\${term}\`))
  );
}`
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

<!-- Percent Pipe -->
<p>{{ ratio | percent }}</p>           <!-- 75% -->
<p>{{ ratio | percent:'2.2-2' }}</p>   <!-- 75.00% -->

<!-- Text Transform -->
<p>{{ name | uppercase }}</p>          <!-- JOHN DOE -->
<p>{{ name | lowercase }}</p>          <!-- john doe -->
<p>{{ name | titlecase }}</p>          <!-- John Doe -->

<!-- JSON - Debug -->
<pre>{{ user | json }}</pre>

<!-- Slice -->
<p>{{ items | slice:0:5 }}</p>         <!-- First 5 items -->`
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
      loading: loading$ | async
    }; as vm) {
      @if (vm.loading) {
        <app-spinner />
      } @else if (vm.users && vm.config) {
        <app-user-list
          [users]="vm.users"
          [config]="vm.config"
        />
      }
    }

    <!-- Combine với other pipes -->
    <p>{{ (user$ | async)?.createdAt | date:'medium' }}</p>
    <p>{{ (price$ | async) | currency:'VND' }}</p>
  \`
})
export class UserListComponent {
  private userService = inject(UserService);

  users$ = this.userService.getUsers();
  config$ = this.configService.getConfig();
  loading$ = this.loadingService.isLoading$;
  user$ = this.userService.currentUser$;
  price$ = this.priceService.getPrice();
}`
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

// Pipe với multiple arguments
@Pipe({ name: 'fileSize', standalone: true })
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, decimals = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }
}
// Sử dụng: {{ file.size | fileSize:1 }} => "2.5 MB"

// Time ago pipe
@Pipe({ name: 'timeAgo', standalone: true })
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'vừa xong';
    if (seconds < 3600) return Math.floor(seconds / 60) + ' phút trước';
    if (seconds < 86400) return Math.floor(seconds / 3600) + ' giờ trước';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + ' ngày trước';
    return Math.floor(seconds / 2592000) + ' tháng trước';
  }
}
// Sử dụng: {{ post.createdAt | timeAgo }} => "5 phút trước"`
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
  name: 'filterImpure',
  standalone: true,
  pure: false // Impure!
})
export class FilterImpurePipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    console.log('Impure pipe executed'); // Log mỗi CD cycle!
    return items.filter(item => item[field] === value);
  }
}

// BEST PRACTICE: Dùng pure pipe + immutable data
@Component({
  template: \`
    @for (item of (items | filterPure:'status':'active'); track item.id) {
      <div>{{ item.name }}</div>
    }
  \`
})
export class MyComponent {
  items: Item[] = [];

  addItem(item: Item) {
    // Tạo array mới để trigger pure pipe
    this.items = [...this.items, item];
  }

  removeItem(id: number) {
    this.items = this.items.filter(i => i.id !== id);
  }
}`
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
  @Input() user!: User;
  // Chỉ check khi:
  // 1. @Input reference thay đổi
  // 2. Event từ template (click, etc.)
  // 3. Async pipe emit
  // 4. Manual markForCheck()
}

// Manual trigger CD
@Component({...})
export class ManualCDComponent {
  private cdr = inject(ChangeDetectorRef);

  updateData() {
    this.data = newData;
    this.cdr.markForCheck();  // Mark component dirty
    // hoặc
    this.cdr.detectChanges(); // Run CD immediately
  }
}`
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
// [13]: CHILD_HEAD - first child view
// [14]: CHILD_TAIL - last child view
// [15]: DECLARATION_COMPONENT_VIEW
// [16]: DECLARATION_LCONTAINER
// [17]: PREORDER_HOOK_FLAGS
// [18]: QUERIES
// [19]: ID
// [20+]: BINDING VALUES START HERE

// Example: template with 3 bindings
// <p>{{ name }}</p>
// <p>{{ age }}</p>
// <button [disabled]="loading">
//
// LView: [...metadata..., 'John', 25, false]
//                         ^20    ^21  ^22 (binding indices)

// Dirty checking pseudo-code:
function refreshView(lView: LView, tView: TView) {
  const bindingIndex = getBindingIndex();

  // Check binding at index 20
  const newValue1 = componentInstance.name;
  if (lView[20] !== newValue1) {
    lView[20] = newValue1;          // Store new value
    updateTextNode(element, newValue1);  // Update DOM
  }

  // Check binding at index 21
  const newValue2 = componentInstance.age;
  if (lView[21] !== newValue2) {
    lView[21] = newValue2;
    updateTextNode(element2, newValue2);
  }

  // ... continue for all bindings
}`
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
      detectChangesInRootView(view);
    }
  }
}

// OnPush dirty flag in LView
const FLAGS_INDEX = 2;
const enum LViewFlags {
  CheckAlways = 0b0001,    // Default strategy
  Dirty = 0b0010,          // Needs check
  Attached = 0b0100,       // In CD tree
  // ...more flags
}

// markForCheck() implementation
function markForCheck(lView: LView) {
  let currentView = lView;
  while (currentView) {
    // Mark this view and all ancestors as dirty
    currentView[FLAGS_INDEX] |= LViewFlags.Dirty;
    currentView = currentView[PARENT];
  }
}

// detectChanges flow with OnPush
function refreshComponent(lView: LView) {
  const flags = lView[FLAGS_INDEX];

  if (flags & LViewFlags.CheckAlways) {
    // Default strategy: always check
    doCheck(lView);
  } else if (flags & LViewFlags.Dirty) {
    // OnPush: only check if dirty
    doCheck(lView);
    lView[FLAGS_INDEX] &= ~LViewFlags.Dirty;  // Clear dirty flag
  }
  // else: OnPush + not dirty = SKIP entirely
}`
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
import { provideExperimentalZonelessChangeDetection } from '@angular/core';

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
    <button (click)="increment()">+</button>
  \`
})
export class ZonelessComponent {
  count = signal(0);

  increment() {
    this.count.update(n => n + 1);
    // Signal change auto-triggers CD
  }
}

// Manual CD trigger without Zone
@Component({...})
export class ManualCDComponent {
  private cdr = inject(ChangeDetectorRef);
  data = '';

  // This WON'T update view in zoneless without signals
  fetchData() {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        this.data = data;
        // Must manually trigger!
        this.cdr.markForCheck();
      });
  }

  // Better: use signals
  dataSignal = signal('');

  fetchDataWithSignal() {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        this.dataSignal.set(data);  // Auto triggers CD
      });
  }
}

// What triggers CD in zoneless mode:
// 1. Signal changes ✅
// 2. Event handlers in template ✅
// 3. Async pipe ✅
// 4. Manual markForCheck()/detectChanges() ✅
// 5. setTimeout/setInterval ❌ (need signal or manual)
// 6. fetch/XHR ❌ (need signal or manual)`
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

  ngOnInit() {
    // Run animation OUTSIDE Angular zone
    // Không trigger CD mỗi frame
    this.zone.runOutsideAngular(() => {
      this.animate();
    });
  }

  private animate() {
    this.position++;
    const box = this.elementRef.nativeElement.querySelector('.animated-box');
    box.style.transform = \`translateX(\${this.position}px)\`;

    if (this.position < 500) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      // Khi xong, update view một lần
      this.zone.run(() => {
        // Code trong đây trigger CD
        console.log('Animation done!');
      });
    }
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Zoneless Angular (experimental)
// Angular 18+ có thể chạy không cần Zone.js
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
});`
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
import { HelloComponent } from './hello.component';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default name', () => {
    expect(component.name).toBe('Angular');
  });

  it('should display name in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Angular');
  });

  it('should update when name changes', () => {
    component.name = 'World';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('World');
  });
});`
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
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';

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

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch users', () => {
    const mockUsers = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ];

    service.getUsers().subscribe(users => {
      expect(users.length).toBe(2);
      expect(users).toEqual(mockUsers);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('GET');
    req.flush(mockUsers);
  });

  it('should handle errors', () => {
    service.getUsers().subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne('/api/users');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });
  });

  it('should create user', () => {
    const newUser = { name: 'Bob', email: 'bob@example.com' };
    const createdUser = { id: 3, ...newUser };

    service.createUser(newUser).subscribe(user => {
      expect(user).toEqual(createdUser);
    });

    const req = httpMock.expectOne('/api/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newUser);
    req.flush(createdUser);
  });
});`
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
import { UserListComponent } from './user-list.component';
import { UserService } from '../services/user.service';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

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
      users: signal(mockUsers)
    });

    userServiceSpy.getUsers.and.returnValue(of(mockUsers));
    userServiceSpy.deleteUser.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it('should load users on init', () => {
    fixture.detectChanges();

    expect(userServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users().length).toBe(2);
  });

  it('should display users in template', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const userElements = compiled.querySelectorAll('.user-item');

    expect(userElements.length).toBe(2);
    expect(userElements[0].textContent).toContain('John');
  });

  it('should show loading state', () => {
    component.loading.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.loading')).toBeTruthy();
  });

  it('should handle delete user', fakeAsync(() => {
    fixture.detectChanges();

    component.deleteUser(1);
    tick();

    expect(userServiceSpy.deleteUser).toHaveBeenCalledWith(1);
  }));

  it('should show error message on failure', fakeAsync(() => {
    userServiceSpy.getUsers.and.returnValue(
      throwError(() => new Error('Network error'))
    );

    fixture.detectChanges();
    tick();

    expect(component.error()).toContain('error');
  }));
});`
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
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormComponent } from './login-form.component';
import { By } from '@angular/platform-browser';

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

  it('should create form with email and password', () => {
    expect(component.form.contains('email')).toBeTrue();
    expect(component.form.contains('password')).toBeTrue();
  });

  it('should mark email as invalid when empty', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('');

    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['required']).toBeTrue();
  });

  it('should mark email as invalid for bad format', () => {
    const emailControl = component.form.get('email');
    emailControl?.setValue('invalid-email');

    expect(emailControl?.valid).toBeFalse();
    expect(emailControl?.errors?.['email']).toBeTrue();
  });

  it('should be valid when form is filled correctly', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });

    expect(component.form.valid).toBeTrue();
  });

  it('should disable submit button when form invalid', () => {
    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeTrue();
  });

  it('should enable submit button when form valid', () => {
    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(button.nativeElement.disabled).toBeFalse();
  });

  it('should call onSubmit when form submitted', () => {
    spyOn(component, 'onSubmit');

    component.form.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    fixture.detectChanges();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('ngSubmit', null);

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should show validation errors after touch', () => {
    const emailInput = fixture.debugElement.query(By.css('input[formControlName="email"]'));
    emailInput.triggerEventHandler('blur', null);
    fixture.detectChanges();

    const error = fixture.debugElement.query(By.css('.error-message'));
    expect(error).toBeTruthy();
  });
});`
          }
        },
        {
          title: 'Testing với Signals',
          content: `Test components sử dụng Signals cần một số cách tiếp cận đặc biệt.`,
          code: {
            language: 'typescript',
            filename: 'signal-component.spec.ts',
            code: `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponent } from './counter.component';
import { signal, computed } from '@angular/core';

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

  it('should initialize count to 0', () => {
    expect(component.count()).toBe(0);
  });

  it('should increment count', () => {
    component.increment();
    expect(component.count()).toBe(1);
  });

  it('should compute double correctly', () => {
    component.count.set(5);
    expect(component.doubleCount()).toBe(10);
  });

  it('should update view when signal changes', () => {
    component.count.set(42);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('42');
  });

  // Testing signal inputs
  it('should accept signal input', () => {
    // For signal inputs, set via component reference
    fixture.componentRef.setInput('title', 'New Title');
    fixture.detectChanges();

    expect(component.title()).toBe('New Title');
  });

  // Testing effects
  it('should trigger effect on signal change', () => {
    const consoleSpy = spyOn(console, 'log');

    component.count.set(10);
    // Effects run synchronously after signal update

    expect(consoleSpy).toHaveBeenCalledWith('Count changed:', 10);
  });
});

// Testing service với signals
describe('TodoStore (Signals)', () => {
  let store: TodoStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodoStore]
    });
    store = TestBed.inject(TodoStore);
  });

  it('should add todo', () => {
    store.addTodo('Test todo');

    expect(store.todos().length).toBe(1);
    expect(store.todos()[0].title).toBe('Test todo');
  });

  it('should compute filtered todos', () => {
    store.addTodo('Todo 1');
    store.addTodo('Todo 2');
    store.toggleTodo(store.todos()[0].id);

    store.setFilter('active');
    expect(store.filteredTodos().length).toBe(1);

    store.setFilter('completed');
    expect(store.filteredTodos().length).toBe(1);

    store.setFilter('all');
    expect(store.filteredTodos().length).toBe(2);
  });

  it('should compute stats correctly', () => {
    store.addTodo('Todo 1');
    store.addTodo('Todo 2');
    store.toggleTodo(store.todos()[0].id);

    expect(store.stats()).toEqual({
      total: 2,
      active: 1,
      completed: 1
    });
  });
});`
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

  // Ivy thêm static property này
  static ɵcmp = defineComponent({
    type: HelloComponent,
    selectors: [['app-hello']],
    decls: 2, // Number of DOM elements
    vars: 1,  // Number of bindings

    // Template function - thay thế HTML template
    template: function HelloComponent_Template(rf, ctx) {
      if (rf & RenderFlags.Create) {
        // Create phase: tạo DOM một lần
        ɵɵelementStart(0, 'h1');
        ɵɵtext(1);
        ɵɵelementEnd();
      }
      if (rf & RenderFlags.Update) {
        // Update phase: chạy mỗi change detection
        ɵɵadvance(1);
        ɵɵtextInterpolate1('Hello ', ctx.name, '!');
      }
    }
  });
}

// Template instructions:
// ɵɵelementStart(index, tagName) - Bắt đầu element
// ɵɵelementEnd() - Kết thúc element
// ɵɵtext(index) - Tạo text node
// ɵɵtextInterpolate1(prefix, value, suffix) - Text với interpolation
// ɵɵadvance(n) - Di chuyển index n vị trí
// ɵɵproperty(name, value) - Set property
// ɵɵlistener(event, handler) - Event listener

// Xem generated code:
// ng build --source-map
// Mở browser DevTools, xem Sources panel`
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
// 1. Track execution
// 2. Notify listeners (như Angular)
// 3. Handle errors

// Angular's NgZone
@Injectable({ providedIn: 'root' })
class ApplicationRef {
  constructor(private zone: NgZone) {
    // Subscribe to zone events
    this.zone.onMicrotaskEmpty.subscribe(() => {
      // Khi tất cả microtasks complete
      this.tick(); // Trigger change detection
    });
  }

  tick() {
    // Run change detection on all views
    this._views.forEach(view => view.detectChanges());
  }
}

// Ví dụ: Tại sao click event trigger CD?
// 1. User click button
// 2. Zone.js đã wrap addEventListener
// 3. Click handler chạy trong Angular zone
// 4. Handler complete -> microtask empty
// 5. NgZone emit onMicrotaskEmpty
// 6. ApplicationRef.tick() -> Change Detection

// runOutsideAngular - tránh trigger CD
@Component({ ... })
export class HeavyAnimationComponent {
  constructor(private zone: NgZone) {}

  startAnimation() {
    // Animation loop sẽ KHÔNG trigger CD
    this.zone.runOutsideAngular(() => {
      const animate = () => {
        this.updateAnimation();
        requestAnimationFrame(animate);
      };
      animate();
    });
  }

  updateAnimation() {
    // Manipulate DOM directly
    this.element.style.transform = \`translateX(\${this.x}px)\`;
  }

  // Khi cần update view
  updateView() {
    this.zone.run(() => {
      this.position = this.x;
      // CD will run after this
    });
  }
}

// Kiểm tra code đang chạy trong zone nào
console.log('Current zone:', Zone.current.name);
// 'angular' nếu trong Angular zone
// 'root' nếu ngoài Angular zone`
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
      const newValue = evaluateBinding(view, i);

      if (oldValue !== newValue) {
        // Value changed - update DOM
        updateDom(view, i, newValue);
        view.oldValues[i] = newValue;

        // Dev mode: check for ExpressionChangedAfterItHasBeenChecked
        if (isDevMode() && view.state === ViewState.AfterChecked) {
          throw new Error('ExpressionChangedAfterItHasBeenCheckedError');
        }
      }
    }

    // 5. Check content children
    detectChangesInContentChildren(view);

    // 6. Call AfterContentChecked
    callHook(component, 'ngAfterContentChecked');

    // 7. Check view children
    detectChangesInViewChildren(view);

    // 8. Call AfterViewChecked
    callHook(component, 'ngAfterViewChecked');
  }
}

// OnPush internal logic
function shouldCheckComponent(view: LView): boolean {
  const flags = view[FLAGS];

  // CheckAlways (Default strategy)
  if (flags & LViewFlags.CheckAlways) {
    return true;
  }

  // OnPush - chỉ check nếu:
  // 1. Component marked dirty
  // 2. Input reference changed
  // 3. Event from component or children
  // 4. Async pipe emitted
  // 5. markForCheck() called
  return (flags & LViewFlags.Dirty) !== 0;
}

// Tại sao === thay vì deep compare?
// Performance! Deep compare O(n), === là O(1)
// Đây là lý do immutable data patterns quan trọng với OnPush

// markForCheck() internal
function markForCheck(view: LView) {
  let currentView = view;

  // Mark component và TẤT CẢ ancestors dirty
  while (currentView) {
    currentView[FLAGS] |= LViewFlags.Dirty;
    currentView = currentView[PARENT];
  }

  // Đây là lý do signals + OnPush efficient
  // Signals tự động gọi markForCheck()
}

// ExpressionChangedAfterItHasBeenCheckedError
// Xảy ra khi: value thay đổi TRONG quá trình CD
@Component({ ... })
class BadComponent {
  value = 0;

  ngAfterViewInit() {
    // ERROR in dev mode!
    // CD đã check value, giờ bạn thay đổi nó
    this.value = 1;

    // Fix: dùng setTimeout hoặc ChangeDetectorRef
    // setTimeout(() => this.value = 1);
    // this.cdr.detectChanges();
  }
}`
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
        record.value = CIRCULAR; // Mark to detect circular
        record.value = record.factory(); // Create instance
      }

      return record.value;
    }

    // Not found, try parent
    currentInjector = currentInjector.parent;
  }

  // Reached NullInjector
  throw new Error(\`No provider for \${token}\`);
}

// InjectionToken - type-safe way to inject non-class values
import { InjectionToken, inject } from '@angular/core';

// Define token
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'https://api.default.com'
});

export const FEATURE_FLAGS = new InjectionToken<FeatureFlags>('FEATURE_FLAGS');

export interface FeatureFlags {
  darkMode: boolean;
  betaFeatures: boolean;
}

// Provide
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: API_URL, useValue: 'https://api.prod.com' },
    {
      provide: FEATURE_FLAGS,
      useFactory: () => ({
        darkMode: true,
        betaFeatures: environment.enableBeta
      })
    }
  ]
};

// Inject
@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = inject(API_URL);
  private features = inject(FEATURE_FLAGS);
}

// Multi providers - multiple values for same token
export const HTTP_INTERCEPTORS = new InjectionToken<HttpInterceptorFn[]>('HTTP_INTERCEPTORS');

// Mỗi provider ADD vào array, không replace
providers: [
  { provide: HTTP_INTERCEPTORS, useValue: authInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useValue: loggingInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useValue: errorInterceptor, multi: true },
]

// Inject multi
const interceptors = inject(HTTP_INTERCEPTORS); // [auth, logging, error]

// forwardRef - giải quyết circular dependencies
@Injectable()
class ServiceA {
  constructor(
    @Inject(forwardRef(() => ServiceB)) private b: ServiceB
  ) {}
}

@Injectable()
class ServiceB {
  constructor(private a: ServiceA) {}
}

// Resolution modifiers
@Injectable()
class MyService {
  // @Optional - không throw error nếu không tìm thấy
  logger = inject(LoggerService, { optional: true });

  // @Self - chỉ tìm trong injector hiện tại
  config = inject(CONFIG, { self: true });

  // @SkipSelf - bỏ qua injector hiện tại, tìm từ parent
  parentService = inject(ParentService, { skipSelf: true });

  // @Host - tìm đến host component, không đi xa hơn
  hostConfig = inject(HOST_CONFIG, { host: true });
}`
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
    dependents: new Set(),
    dependencies: new Set(),
    dirty: false
  };

  // Read function
  function signalFn(): T {
    // Track dependency nếu đang trong reactive context
    trackDependency(node);
    return node.value;
  }

  signalFn.set = (newValue: T) => {
    if (node.value !== newValue) {
      node.value = newValue;
      node.version++;
      // Notify all dependents
      notifyDependents(node);
    }
  };

  signalFn.update = (fn: (v: T) => T) => {
    signalFn.set(fn(node.value));
  };

  return signalFn;
}

// Computed Signal
function createComputed<T>(computation: () => T): Signal<T> {
  const node: ReactiveNode = {
    value: undefined,
    version: 0,
    dependents: new Set(),
    dependencies: new Set(),
    dirty: true, // Start dirty
    compute: computation
  };

  function computedFn(): T {
    trackDependency(node);

    if (node.dirty) {
      // Clear old dependencies
      node.dependencies.forEach(dep => {
        dep.dependents.delete(node);
      });
      node.dependencies.clear();

      // Run computation trong reactive context
      const previousContext = currentReactiveContext;
      currentReactiveContext = node;

      try {
        node.value = node.compute!();
        node.dirty = false;
        node.version++;
      } finally {
        currentReactiveContext = previousContext;
      }
    }

    return node.value;
  }

  return computedFn;
}

// Tracking mechanism
let currentReactiveContext: ReactiveNode | null = null;

function trackDependency(node: ReactiveNode) {
  if (currentReactiveContext) {
    // Establish bidirectional link
    currentReactiveContext.dependencies.add(node);
    node.dependents.add(currentReactiveContext);
  }
}

function notifyDependents(node: ReactiveNode) {
  node.dependents.forEach(dependent => {
    dependent.dirty = true;
    // Propagate to dependents of dependents
    notifyDependents(dependent);
  });

  // Schedule change detection if in Angular context
  if (isInAngularContext()) {
    markViewDirty();
  }
}

// Effect implementation
function createEffect(effectFn: () => void) {
  const node: ReactiveNode = {
    value: undefined,
    version: 0,
    dependents: new Set(),
    dependencies: new Set(),
    dirty: true,
    compute: effectFn
  };

  // Run immediately
  runEffect(node);

  // Setup watcher
  const watcher = {
    notify: () => {
      // Schedule effect to run
      scheduleEffect(node);
    }
  };

  return watcher;
}

// Glitch-free example
const a = signal(1);
const b = signal(2);
const sum = computed(() => a() + b());
const doubled = computed(() => sum() * 2);

// Khi a.set(10):
// 1. a version++, mark dependents dirty
// 2. sum marked dirty, doubled marked dirty
// 3. Khi doubled() được gọi:
//    - doubled dirty -> cần recalculate
//    - doubled đọc sum() -> sum recalculate (1 lần)
//    - doubled calculate với new sum value
// 4. Không bao giờ thấy inconsistent state`
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
@Component({
  template: \`@if (show) { <div>Hello</div> }\`
})
// Generated code includes ɵɵtemplate

// Component không có ngIf
@Component({
  template: \`<div>Hello</div>\`
})
// ɵɵtemplate không được include

// Analyze bundle
// 1. Build với stats
// ng build --stats-json

// 2. Analyze với webpack-bundle-analyzer
// npx webpack-bundle-analyzer dist/my-app/stats.json

// 3. Source map explorer
// npx source-map-explorer dist/my-app/*.js

// Common bundle bloaters:
// - moment.js (dùng date-fns hoặc luxon)
// - lodash (import { specific } from 'lodash-es')
// - rxjs (import { specific } from 'rxjs')
// - Large icon libraries (import specific icons)

// Lazy loading để split bundles
const routes: Routes = [
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component')
      .then(m => m.AdminComponent)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/routes')
      .then(m => m.DASHBOARD_ROUTES)
  }
];

// Dynamic imports cho heavy libraries
async loadChart() {
  const { Chart } = await import('chart.js');
  // Use Chart only when needed
}

// Preloading strategies
provideRouter(routes,
  withPreloading(PreloadAllModules) // Preload sau initial load
);

// Custom preloading
@Injectable()
export class SelectivePreloadingStrategy implements PreloadAllModules {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Chỉ preload routes có preload: true
    return route.data?.['preload'] ? load() : of(null);
  }
}`
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
})
export class UserCardComponent {
  user = input.required<User>();
  edit = output<User>();
  delete = output<number>();
}

// Dumb component với content projection
@Component({
  selector: 'app-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <div class="card" [class]="variant()">
      <div class="card-header">
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="card-body">
        <ng-content></ng-content>
      </div>
      <div class="card-footer">
        <ng-content select="[card-footer]"></ng-content>
      </div>
    </div>
  \`
})
export class CardComponent {
  variant = input<'default' | 'primary' | 'danger'>('default');
}

// ========== SMART COMPONENT ==========
// Orchestrates data và logic
@Component({
  selector: 'app-user-list-page',
  standalone: true,
  imports: [UserCardComponent, CardComponent, AsyncPipe],
  template: \`
    <div class="user-list-page">
      <header>
        <h1>Users</h1>
        <button (click)="openCreateDialog()">Add User</button>
      </header>

      @if (loading()) {
        <app-spinner />
      }

      @if (error(); as err) {
        <app-error-message [message]="err" (retry)="loadUsers()" />
      }

      <div class="grid">
        @for (user of users(); track user.id) {
          <app-user-card
            [user]="user"
            (edit)="openEditDialog($event)"
            (delete)="confirmDelete($event)"
          />
        } @empty {
          <app-empty-state message="No users found" />
        }
      </div>
    </div>
  \`
})
export class UserListPageComponent implements OnInit {
  private userService = inject(UserService);
  private dialog = inject(DialogService);
  private destroyRef = inject(DestroyRef);

  // State
  users = signal<User[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUsers().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.message);
        this.loading.set(false);
      }
    });
  }

  openEditDialog(user: User) {
    this.dialog.open(UserFormComponent, { data: user }).afterClosed()
      .subscribe(result => {
        if (result) this.loadUsers();
      });
  }

  confirmDelete(userId: number) {
    this.dialog.confirm('Delete user?').subscribe(confirmed => {
      if (confirmed) {
        this.userService.delete(userId).subscribe(() => this.loadUsers());
      }
    });
  }
}`
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
    loading: false
  });

  // Selectors - derived state
  readonly todos = computed(() => this.state().todos);
  readonly filter = computed(() => this.state().filter);
  readonly loading = computed(() => this.state().loading);

  readonly filteredTodos = computed(() => {
    const { todos, filter } = this.state();
    switch (filter) {
      case 'active': return todos.filter(t => !t.completed);
      case 'completed': return todos.filter(t => t.completed);
      default: return todos;
    }
  });

  readonly stats = computed(() => {
    const todos = this.todos();
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  });

  // Actions - methods that modify state
  addTodo(title: string) {
    this.state.update(s => ({
      ...s,
      todos: [...s.todos, { id: Date.now(), title, completed: false }]
    }));
  }

  toggleTodo(id: number) {
    this.state.update(s => ({
      ...s,
      todos: s.todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    }));
  }

  setFilter(filter: TodoState['filter']) {
    this.state.update(s => ({ ...s, filter }));
  }

  // Async action
  async loadTodos() {
    this.state.update(s => ({ ...s, loading: true }));

    try {
      const todos = await this.api.getTodos();
      this.state.update(s => ({ ...s, todos, loading: false }));
    } catch (error) {
      this.state.update(s => ({ ...s, loading: false }));
      throw error;
    }
  }
}

// ========== PATTERN 2: Feature Store ==========
// For larger features with complex state

@Injectable()
export class UserFeatureStore {
  private http = inject(HttpClient);

  // State slices
  private _users = signal<User[]>([]);
  private _selectedUserId = signal<number | null>(null);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Public selectors
  readonly users = this._users.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly selectedUser = computed(() => {
    const id = this._selectedUserId();
    return id ? this._users().find(u => u.id === id) : null;
  });

  // Actions with RxJS for complex async
  loadUsers(): Observable<void> {
    return defer(() => {
      this._loading.set(true);
      this._error.set(null);

      return this.http.get<User[]>('/api/users').pipe(
        tap(users => {
          this._users.set(users);
          this._loading.set(false);
        }),
        catchError(err => {
          this._error.set(err.message);
          this._loading.set(false);
          return EMPTY;
        }),
        map(() => void 0)
      );
    });
  }

  selectUser(id: number | null) {
    this._selectedUserId.set(id);
  }
}

// Provide at feature level
export const USER_FEATURE_PROVIDERS = [
  UserFeatureStore,
  // other feature services
];

// In feature routes
export const userRoutes: Routes = [
  {
    path: '',
    providers: USER_FEATURE_PROVIDERS,
    children: [
      { path: '', component: UserListComponent },
      { path: ':id', component: UserDetailComponent }
    ]
  }
];`
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
  readonly hasUsers = computed(() => this.users().length > 0);
  readonly isEditing = computed(() => this.selectedUser() !== null);

  // High-level actions that orchestrate multiple operations
  async loadUsers(): Promise<void> {
    try {
      await this.store.loadUsers();
    } catch (error) {
      this.notificationService.error('Failed to load users');
    }
  }

  async createUser(data: CreateUserDto): Promise<void> {
    try {
      const user = await this.api.create(data);
      this.store.addUser(user);
      this.notificationService.success('User created');
      this.router.navigate(['/users', user.id]);
    } catch (error) {
      this.notificationService.error('Failed to create user');
      throw error;
    }
  }

  async updateUser(id: number, data: UpdateUserDto): Promise<void> {
    try {
      const user = await this.api.update(id, data);
      this.store.updateUser(user);
      this.notificationService.success('User updated');
    } catch (error) {
      this.notificationService.error('Failed to update user');
      throw error;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    const confirmed = await this.confirmDelete();
    if (!confirmed) return false;

    try {
      await this.api.delete(id);
      this.store.removeUser(id);
      this.notificationService.success('User deleted');

      // Navigate away nếu đang view user này
      if (this.selectedUser()?.id === id) {
        this.router.navigate(['/users']);
      }
      return true;
    } catch (error) {
      this.notificationService.error('Failed to delete user');
      return false;
    }
  }

  selectUser(id: number | null): void {
    this.store.selectUser(id);
  }

  // Private helpers
  private confirmDelete(): Promise<boolean> {
    return firstValueFrom(
      this.dialog.confirm({
        title: 'Delete User',
        message: 'Are you sure?'
      })
    );
  }
}

// Component sử dụng Facade - clean và simple
@Component({
  template: \`
    @if (facade.loading()) {
      <app-spinner />
    }

    @for (user of facade.users(); track user.id) {
      <app-user-card
        [user]="user"
        (delete)="facade.deleteUser($event)"
      />
    }
  \`
})
export class UserListComponent implements OnInit {
  facade = inject(UserFacade);

  ngOnInit() {
    this.facade.loadUsers();
  }
}

// Testing với Facade - easy to mock
describe('UserListComponent', () => {
  let mockFacade: jasmine.SpyObj<UserFacade>;

  beforeEach(() => {
    mockFacade = jasmine.createSpyObj('UserFacade', ['loadUsers'], {
      users: signal([]),
      loading: signal(false)
    });

    TestBed.configureTestingModule({
      imports: [UserListComponent],
      providers: [{ provide: UserFacade, useValue: mockFacade }]
    });
  });
});`
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
│   │   ├── products/
│   │   │   ├── domain/          # Domain layer
│   │   │   │   ├── models/
│   │   │   │   │   ├── product.model.ts
│   │   │   │   │   └── category.model.ts
│   │   │   │   ├── services/
│   │   │   │   │   └── product-domain.service.ts
│   │   │   │   └── validators/
│   │   │   │       └── product.validators.ts
│   │   │   │
│   │   │   ├── application/     # Application layer
│   │   │   │   ├── facades/
│   │   │   │   │   └── product.facade.ts
│   │   │   │   ├── state/
│   │   │   │   │   └── product.store.ts
│   │   │   │   └── use-cases/
│   │   │   │       ├── create-product.use-case.ts
│   │   │   │       └── update-inventory.use-case.ts
│   │   │   │
│   │   │   ├── infrastructure/  # Infrastructure layer
│   │   │   │   ├── api/
│   │   │   │   │   └── product-api.service.ts
│   │   │   │   └── mappers/
│   │   │   │       └── product.mapper.ts
│   │   │   │
│   │   │   ├── presentation/    # Presentation layer
│   │   │   │   ├── pages/
│   │   │   │   │   ├── product-list/
│   │   │   │   │   └── product-detail/
│   │   │   │   ├── components/
│   │   │   │   │   ├── product-card/
│   │   │   │   │   └── product-form/
│   │   │   │   └── containers/
│   │   │   │       └── product-list-container/
│   │   │   │
│   │   │   ├── product.routes.ts
│   │   │   └── index.ts         # Public API
│   │   │
│   │   ├── orders/              # Another bounded context
│   │   │   └── ... (same structure)
│   │   │
│   │   └── shared-kernel/       # Shared between contexts
│   │       ├── models/
│   │       └── services/
│   │
│   └── shared/                  # UI shared (không phải domain)
│       ├── components/
│       ├── directives/
│       └── pipes/
│
└── libs/                        # Extracted libraries
    └── ui-components/`
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

// GOOD - only runs when input changes
<div>{{ item.date | dateFormat }}</div>

// 4. Memoization với computed signals
readonly expensiveValue = computed(() => {
  // Chỉ recalculate khi dependencies thay đổi
  return this.items().reduce((sum, item) => sum + item.value, 0);
});

// ========== VIRTUALIZATION FOR LARGE LISTS ==========
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  template: \`
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items" class="item">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  \`,
  styles: [\`
    .viewport { height: 400px; }
    .item { height: 50px; }
  \`]
})

// ========== DEFER LOADING (Angular 17+) ==========
@Component({
  template: \`
    <!-- Load khi scroll vào view -->
    @defer (on viewport) {
      <app-heavy-chart [data]="chartData" />
    } @placeholder {
      <div class="chart-placeholder">Chart loading...</div>
    } @loading (minimum 200ms) {
      <app-spinner />
    }

    <!-- Load khi hover -->
    @defer (on hover) {
      <app-preview-card />
    }

    <!-- Load khi idle -->
    @defer (on idle) {
      <app-analytics />
    }

    <!-- Load với condition -->
    @defer (when showComments) {
      <app-comments />
    }
  \`
})

// ========== MEMORY MANAGEMENT ==========
@Component({...})
export class MyComponent implements OnDestroy {
  private destroy$ = new Subject<void>();

  // Pattern 1: takeUntil
  ngOnInit() {
    this.someObservable$.pipe(
      takeUntil(this.destroy$)
    ).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Pattern 2: takeUntilDestroyed (Angular 16+)
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.someObservable$.pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe();
  }

  // Pattern 3: async pipe (best - no manual cleanup)
  data$ = this.service.getData();
  // template: {{ data$ | async }}
}

// ========== WEB WORKERS FOR HEAVY COMPUTATION ==========
// Generate worker: ng generate web-worker heavy-computation

// heavy-computation.worker.ts
addEventListener('message', ({ data }) => {
  const result = performHeavyCalculation(data);
  postMessage(result);
});

// component.ts
@Component({...})
export class DataProcessorComponent {
  private worker?: Worker;

  processData(data: any[]) {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(
        new URL('./heavy-computation.worker', import.meta.url)
      );

      this.worker.onmessage = ({ data }) => {
        this.result.set(data);
      };

      this.worker.postMessage(data);
    } else {
      // Fallback for environments without Worker support
      this.result.set(performHeavyCalculation(data));
    }
  }

  ngOnDestroy() {
    this.worker?.terminate();
  }
}`
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
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { UserListComponent } from './users/user-list.component';

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
export class AppModule { }`
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
  exports: [
    UserListComponent // Export để dùng ở module khác
  ]
})
export class UsersModule { }

// Lazy load trong AppRoutingModule
const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./users/users.module')
      .then(m => m.UsersModule)
  }
];`
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
    FormsModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    AlertComponent,
    HighlightDirective,
    TruncatePipe
  ]
})
export class SharedModule { }

// Sử dụng trong feature module
@NgModule({
  imports: [SharedModule], // Import một lần, có tất cả
  declarations: [...]
})
export class FeatureModule { }`
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

<!-- *ngIf với as (lưu giá trị) -->
<div *ngIf="user$ | async as user">
  {{ user.name }} - {{ user.email }}
</div>

<!-- Cú pháp mới Angular 17+ -->
@if (isLoggedIn) {
  <div>Welcome back!</div>
} @else {
  <p>Please login</p>
}`
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
             let even = even;
             let odd = odd">
  <span [class.highlight]="first">{{ item.name }}</span>
</div>

<!-- trackBy để tối ưu performance -->
<div *ngFor="let item of items; trackBy: trackByFn">
  {{ item.name }}
</div>

<!-- Trong component.ts -->
trackByFn(index: number, item: Item): number {
  return item.id; // Unique identifier
}

<!-- Cú pháp mới Angular 17+ -->
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
} @empty {
  <p>No items found</p>
}`
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

<!-- Cú pháp mới Angular 17+ -->
@switch (status) {
  @case ('active') {
    <p>User is active</p>
  }
  @case ('pending') {
    <p>User is pending</p>
  }
  @default {
    <p>Unknown status</p>
  }
}`
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
  templateUrl: './header.component.html'
})
export class HeaderComponent {}

// ========== MỚI: Standalone ==========
// app.component.ts
@Component({
  selector: 'app-root',
  standalone: true, // Angular 17+ mặc định, không cần khai báo
  imports: [HeaderComponent, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent {}

// main.ts
bootstrapApplication(AppComponent, appConfig);

// header.component.ts - Standalone component
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {}`
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

<!-- @if -->
@if (user) {
  <div>{{ user.name }}</div>
} @else {
  <div>No user</div>
}

<!-- @for (track là BẮT BUỘC) -->
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items</li>
}

<!-- @switch -->
@switch (status) {
  @case ('active') { <span>Active</span> }
  @default { <span>Unknown</span> }
}`
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

// ========== MỚI: inject() function ==========
@Component({...})
export class UserComponent {
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private logger = inject(LoggerService, { optional: true });

  // Có thể dùng ngay trong field initializer
  users = this.userService.users$;

  loadUsers() {
    this.userService.getUsers().subscribe(...);
  }
}

// inject() với options
const service = inject(MyService, {
  optional: true,  // Không throw error nếu không tìm thấy
  self: true,      // Chỉ tìm trong injector hiện tại
  skipSelf: true,  // Bỏ qua injector hiện tại
  host: true       // Tìm trong host component
});`
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
    this.destroy$.complete();
  }
}

// Template phải dùng async pipe
// {{ count$ | async }}
// {{ doubled$ | async }}

// ========== MỚI: Signals ==========
@Component({...})
export class CounterComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  increment() {
    this.count.update(n => n + 1);
    // hoặc: this.count.set(this.count() + 1);
  }

  // Không cần cleanup!
}

// Template đơn giản hơn
// {{ count() }}
// {{ doubled() }}

// Convert giữa Signal và Observable
const countSignal = toSignal(count$);
const count$ = toObservable(countSignal);`
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
    UserListComponent // Standalone component
  ]
})
export class AppModule {}

// BƯỚC 3: Dần dần chuyển sang control flow mới
// Có thể dùng Angular CLI schematics:
// ng generate @angular/core:control-flow

// BƯỚC 4: Chuyển sang inject()
// Thay constructor injection bằng inject()

// BƯỚC 5: Thêm Signals cho state management mới
// Giữ RxJS cho existing code, dùng Signals cho code mới

// BƯỚC 6: Cuối cùng, bootstrap không cần AppModule
// main.ts
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});`
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
