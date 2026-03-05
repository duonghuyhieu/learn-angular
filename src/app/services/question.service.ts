import { Injectable, signal, computed } from '@angular/core';
import { Question, GameState, AnsweredQuestion } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private questions: Question[] = [
    // === BASICS ===
    {
      id: 1,
      question: 'Angular sử dụng ngôn ngữ nào làm chính?',
      options: ['JavaScript', 'TypeScript', 'Dart', 'CoffeeScript'],
      correctAnswer: 1,
      explanation: 'Angular được viết bằng TypeScript và khuyến khích developers sử dụng TypeScript để có type safety và các tính năng OOP tốt hơn.',
      category: 'basics',
      difficulty: 'easy'
    },
    {
      id: 2,
      question: 'Decorator nào dùng để định nghĩa một Component trong Angular?',
      options: ['@NgModule', '@Component', '@Injectable', '@Directive'],
      correctAnswer: 1,
      explanation: '@Component là decorator dùng để đánh dấu một class là Angular component, bao gồm metadata như selector, template, styles.',
      category: 'components',
      difficulty: 'easy'
    },
    {
      id: 3,
      question: 'Cú pháp nào dùng cho Two-way data binding trong Angular?',
      options: ['[property]', '(event)', '[(ngModel)]', '{{expression}}'],
      correctAnswer: 2,
      explanation: '[(ngModel)] là cú pháp "banana in a box" dùng cho two-way binding, kết hợp property binding [] và event binding ().',
      category: 'basics',
      difficulty: 'easy'
    },
    {
      id: 4,
      question: 'Interpolation trong Angular sử dụng cú pháp nào?',
      options: ['[value]', '(click)', '{{value}}', '*ngIf'],
      correctAnswer: 2,
      explanation: '{{value}} là cú pháp interpolation, dùng để hiển thị giá trị của biến/expression trong template.',
      category: 'basics',
      difficulty: 'easy'
    },

    // === COMPONENTS ===
    {
      id: 5,
      question: 'Để truyền data từ parent xuống child component, ta dùng decorator nào?',
      options: ['@Output()', '@Input()', '@ViewChild()', '@Inject()'],
      correctAnswer: 1,
      explanation: '@Input() decorator cho phép parent component truyền data xuống child thông qua property binding.',
      category: 'components',
      difficulty: 'easy'
    },
    {
      id: 6,
      question: 'Để child component gửi event lên parent, ta dùng gì?',
      options: ['@Input() với callback', '@Output() với EventEmitter', 'Service injection', 'ViewChild'],
      correctAnswer: 1,
      explanation: '@Output() kết hợp với EventEmitter cho phép child emit events mà parent có thể lắng nghe.',
      category: 'components',
      difficulty: 'easy'
    },
    {
      id: 7,
      question: 'Từ Angular 19+, standalone component được khai báo như thế nào?',
      options: ['Phải viết standalone: true trong @Component', 'Tất cả component đều standalone mặc định', '@Standalone() decorator', 'Phải import StandaloneModule'],
      correctAnswer: 1,
      explanation: 'Từ Angular 19+, tất cả component mặc định là standalone. Không cần khai báo standalone: true nữa. Ở Angular 17-18, vẫn cần viết standalone: true.',
      category: 'components',
      difficulty: 'medium'
    },
    {
      id: 8,
      question: 'Content projection trong Angular dùng element nào?',
      options: ['<ng-template>', '<ng-content>', '<ng-container>', '<router-outlet>'],
      correctAnswer: 1,
      explanation: '<ng-content> cho phép project nội dung từ parent vào vị trí cụ thể trong child component template.',
      category: 'components',
      difficulty: 'medium'
    },

    // === DIRECTIVES ===
    {
      id: 9,
      question: '*ngIf là loại directive nào?',
      options: ['Attribute Directive', 'Structural Directive', 'Component Directive', 'Custom Directive'],
      correctAnswer: 1,
      explanation: '*ngIf là Structural Directive vì nó thay đổi cấu trúc DOM (thêm/xóa elements). Dấu * là cú pháp ngắn gọn.',
      category: 'directives',
      difficulty: 'easy'
    },
    {
      id: 10,
      question: 'Trong Angular 17+, cú pháp control flow mới thay thế *ngIf là gì?',
      options: ['#if', '@if', 'ng-if', 'v-if'],
      correctAnswer: 1,
      explanation: '@if là built-in control flow mới trong Angular 17+, có syntax đẹp hơn và performance tốt hơn *ngIf.',
      category: 'directives',
      difficulty: 'medium'
    },
    {
      id: 11,
      question: 'Directive nào dùng để lặp qua một mảng trong Angular truyền thống?',
      options: ['*ngRepeat', '*ngFor', '*ngLoop', '*ngEach'],
      correctAnswer: 1,
      explanation: '*ngFor là structural directive để iterate qua arrays. Syntax: *ngFor="let item of items"',
      category: 'directives',
      difficulty: 'easy'
    },
    {
      id: 12,
      question: 'ngClass directive thuộc loại nào?',
      options: ['Structural Directive', 'Attribute Directive', 'Component', 'Pipe'],
      correctAnswer: 1,
      explanation: 'ngClass là Attribute Directive vì nó thay đổi appearance/behavior của element mà không thay đổi cấu trúc DOM.',
      category: 'directives',
      difficulty: 'medium'
    },

    // === SERVICES & DI ===
    {
      id: 13,
      question: 'Decorator nào dùng để đánh dấu một class là injectable service?',
      options: ['@Service()', '@Injectable()', '@Provider()', '@Inject()'],
      correctAnswer: 1,
      explanation: '@Injectable() decorator đánh dấu class có thể được inject. providedIn: "root" làm nó singleton app-wide.',
      category: 'services',
      difficulty: 'easy'
    },
    {
      id: 14,
      question: 'providedIn: "root" trong @Injectable có nghĩa gì?',
      options: ['Service chỉ dùng trong root component', 'Service là singleton cho toàn app', 'Service được provide ở root module', 'Service không thể inject'],
      correctAnswer: 1,
      explanation: 'providedIn: "root" tạo singleton service cho toàn application, Angular tự động tree-shake nếu không dùng.',
      category: 'services',
      difficulty: 'medium'
    },
    {
      id: 15,
      question: 'Dependency Injection trong Angular hoạt động ở level nào?',
      options: ['Chỉ module level', 'Chỉ component level', 'Hierarchical (module, component, element)', 'Chỉ application level'],
      correctAnswer: 2,
      explanation: 'Angular DI là hierarchical - có thể provide ở root, module, component, hoặc element level với các scope khác nhau.',
      category: 'services',
      difficulty: 'hard'
    },

    // === LIFECYCLE HOOKS ===
    {
      id: 16,
      question: 'Lifecycle hook nào được gọi sau khi component được khởi tạo?',
      options: ['ngOnChanges', 'ngOnInit', 'ngAfterViewInit', 'constructor'],
      correctAnswer: 1,
      explanation: 'ngOnInit được gọi một lần sau khi Angular khởi tạo component và set các @Input properties.',
      category: 'lifecycle',
      difficulty: 'easy'
    },
    {
      id: 17,
      question: 'Hook nào được gọi khi @Input() property thay đổi?',
      options: ['ngOnInit', 'ngOnChanges', 'ngDoCheck', 'ngAfterContentInit'],
      correctAnswer: 1,
      explanation: 'ngOnChanges được gọi mỗi khi @Input property thay đổi, nhận SimpleChanges object chứa giá trị cũ và mới.',
      category: 'lifecycle',
      difficulty: 'medium'
    },
    {
      id: 18,
      question: 'Thứ tự gọi đúng của lifecycle hooks là?',
      options: [
        'constructor → ngOnInit → ngOnChanges',
        'ngOnInit → constructor → ngAfterViewInit',
        'constructor → ngOnChanges → ngOnInit → ngAfterViewInit',
        'ngOnChanges → constructor → ngOnInit'
      ],
      correctAnswer: 2,
      explanation: 'Thứ tự: constructor → ngOnChanges → ngOnInit → ngDoCheck → ngAfterContentInit → ngAfterViewInit → ngOnDestroy',
      category: 'lifecycle',
      difficulty: 'hard'
    },
    {
      id: 19,
      question: 'ngOnDestroy thường dùng để làm gì?',
      options: ['Khởi tạo data', 'Cleanup (unsubscribe, remove listeners)', 'Render view', 'Validate form'],
      correctAnswer: 1,
      explanation: 'ngOnDestroy dùng để cleanup: unsubscribe observables, remove event listeners, clear timers để tránh memory leaks.',
      category: 'lifecycle',
      difficulty: 'easy'
    },

    // === RxJS ===
    {
      id: 20,
      question: 'Observable trong RxJS khác Promise ở điểm nào?',
      options: ['Observable chỉ emit một giá trị', 'Observable có thể emit nhiều giá trị theo thời gian', 'Promise có thể cancel', 'Không khác gì'],
      correctAnswer: 1,
      explanation: 'Observable có thể emit nhiều giá trị, lazy (chỉ execute khi subscribe), có thể cancel, và có nhiều operators.',
      category: 'rxjs',
      difficulty: 'medium'
    },
    {
      id: 21,
      question: 'Operator nào dùng để transform data trong Observable?',
      options: ['filter', 'map', 'tap', 'subscribe'],
      correctAnswer: 1,
      explanation: 'map operator transform mỗi giá trị emit bởi Observable, tương tự Array.map().',
      category: 'rxjs',
      difficulty: 'easy'
    },
    {
      id: 22,
      question: 'Subject trong RxJS là gì?',
      options: ['Chỉ là Observable', 'Chỉ là Observer', 'Vừa là Observable vừa là Observer', 'Không liên quan đến RxJS'],
      correctAnswer: 2,
      explanation: 'Subject vừa là Observable (có thể subscribe) vừa là Observer (có thể emit values bằng next()).',
      category: 'rxjs',
      difficulty: 'medium'
    },
    {
      id: 23,
      question: 'BehaviorSubject khác Subject thường ở điểm nào?',
      options: ['Không khác gì', 'BehaviorSubject cần initial value và emit value mới nhất cho subscriber mới', 'Subject cần initial value', 'BehaviorSubject chỉ emit một lần'],
      correctAnswer: 1,
      explanation: 'BehaviorSubject require initial value và luôn emit giá trị hiện tại cho mỗi subscriber mới.',
      category: 'rxjs',
      difficulty: 'medium'
    },
    {
      id: 24,
      question: 'Pipe async trong template dùng để làm gì?',
      options: ['Transform string', 'Auto subscribe/unsubscribe Observable', 'Format date', 'HTTP request'],
      correctAnswer: 1,
      explanation: 'Async pipe tự động subscribe Observable và unsubscribe khi component destroy, tránh memory leak.',
      category: 'rxjs',
      difficulty: 'easy'
    },

    // === SIGNALS (Angular 16+) ===
    {
      id: 25,
      question: 'Signal trong Angular là gì?',
      options: ['Event emitter', 'Reactive primitive cho state management', 'HTTP interceptor', 'Animation trigger'],
      correctAnswer: 1,
      explanation: 'Signal là reactive primitive mới trong Angular 16+, đơn giản hơn RxJS cho state management, có fine-grained reactivity.',
      category: 'signals',
      difficulty: 'medium'
    },
    {
      id: 26,
      question: 'Cách tạo một signal trong Angular?',
      options: ['new Signal(value)', 'signal(value)', 'createSignal(value)', 'Signal.create(value)'],
      correctAnswer: 1,
      explanation: 'signal(initialValue) function tạo WritableSignal. Đọc giá trị bằng signal(), update bằng set() hoặc update().',
      category: 'signals',
      difficulty: 'easy'
    },
    {
      id: 27,
      question: 'computed() trong Angular Signals dùng để làm gì?',
      options: ['Tạo writable signal', 'Tạo derived/computed value từ signals khác', 'Subscribe signal', 'Destroy signal'],
      correctAnswer: 1,
      explanation: 'computed() tạo read-only signal có giá trị được tính từ các signals khác, tự động update khi dependencies thay đổi.',
      category: 'signals',
      difficulty: 'medium'
    },
    {
      id: 28,
      question: 'effect() trong Angular Signals được dùng khi nào?',
      options: ['Tạo computed signal', 'Side effects khi signal thay đổi', 'HTTP calls', 'Unit testing'],
      correctAnswer: 1,
      explanation: 'effect() chạy side effects khi signals bên trong nó thay đổi. Dùng cho logging, localStorage sync, etc.',
      category: 'signals',
      difficulty: 'medium'
    },

    // === FORMS ===
    {
      id: 29,
      question: 'Hai loại forms trong Angular là gì?',
      options: ['Simple và Complex', 'Template-driven và Reactive', 'Static và Dynamic', 'Sync và Async'],
      correctAnswer: 1,
      explanation: 'Template-driven forms (dùng ngModel) và Reactive forms (dùng FormGroup/FormControl) là 2 approaches trong Angular.',
      category: 'forms',
      difficulty: 'easy'
    },
    {
      id: 30,
      question: 'FormControl trong Reactive Forms đại diện cho gì?',
      options: ['Entire form', 'Single input field', 'Validation rule', 'Submit button'],
      correctAnswer: 1,
      explanation: 'FormControl tracks value và validation state của một input element. FormGroup gom nhiều FormControl.',
      category: 'forms',
      difficulty: 'easy'
    },
    {
      id: 31,
      question: 'Validators.required thuộc loại validator nào?',
      options: ['Async Validator', 'Sync Validator', 'Custom Validator', 'Template Validator'],
      correctAnswer: 1,
      explanation: 'Validators.required là built-in sync validator, check ngay lập tức. Async validators dùng cho server-side validation.',
      category: 'forms',
      difficulty: 'medium'
    },

    // === ROUTING ===
    {
      id: 32,
      question: '<router-outlet> dùng để làm gì?',
      options: ['Navigate programmatically', 'Placeholder để render routed component', 'Define routes', 'Guard routes'],
      correctAnswer: 1,
      explanation: '<router-outlet> là directive đánh dấu nơi Angular sẽ render component của route hiện tại.',
      category: 'routing',
      difficulty: 'easy'
    },
    {
      id: 33,
      question: 'Route Guard nào ngăn user rời khỏi route?',
      options: ['CanActivate', 'CanDeactivate', 'CanLoad', 'Resolve'],
      correctAnswer: 1,
      explanation: 'CanDeactivate guard cho phép confirm trước khi user navigate away (vd: unsaved changes warning).',
      category: 'routing',
      difficulty: 'medium'
    },
    {
      id: 34,
      question: 'Lazy loading route dùng syntax nào?',
      options: ['component: MyComponent', 'loadComponent: () => import(...)', 'lazyLoad: true', 'async: true'],
      correctAnswer: 1,
      explanation: 'loadComponent với dynamic import() cho phép lazy load component, giảm initial bundle size.',
      category: 'routing',
      difficulty: 'medium'
    },
    {
      id: 35,
      question: 'ActivatedRoute service cung cấp thông tin gì?',
      options: ['All routes in app', 'Current route params, data, queryParams', 'Router history', 'Route guards'],
      correctAnswer: 1,
      explanation: 'ActivatedRoute cung cấp access to route params, query params, data, và các thông tin về route hiện tại.',
      category: 'routing',
      difficulty: 'medium'
    },

    // === ADVANCED ===
    {
      id: 36,
      question: 'Change Detection strategy OnPush có ưu điểm gì?',
      options: ['Detect mọi change', 'Chỉ check khi Input reference thay đổi, hiệu năng tốt hơn', 'Tự động detect async', 'Không cần zone.js'],
      correctAnswer: 1,
      explanation: 'OnPush chỉ trigger change detection khi @Input reference thay đổi hoặc event xảy ra, cải thiện performance.',
      category: 'components',
      difficulty: 'hard'
    },
    {
      id: 37,
      question: 'ViewChild decorator dùng để làm gì?',
      options: ['Truyền data xuống child', 'Query và access child component/element từ parent', 'Emit event', 'Inject service'],
      correctAnswer: 1,
      explanation: '@ViewChild() cho phép parent component access child component instance hoặc DOM element.',
      category: 'components',
      difficulty: 'medium'
    },
    {
      id: 38,
      question: 'ng-template dùng để làm gì?',
      options: ['Render ngay lập tức', 'Define template không render, dùng với structural directives', 'Style component', 'Route component'],
      correctAnswer: 1,
      explanation: 'ng-template define template block không tự render, được dùng bởi structural directives hoặc ngTemplateOutlet.',
      category: 'directives',
      difficulty: 'medium'
    },
    {
      id: 39,
      question: 'HttpClient trong Angular return gì?',
      options: ['Promise', 'Observable', 'Callback', 'EventEmitter'],
      correctAnswer: 1,
      explanation: 'HttpClient methods return Observable, cho phép cancel request, retry, và sử dụng RxJS operators.',
      category: 'services',
      difficulty: 'easy'
    },
    {
      id: 40,
      question: 'Interceptor trong Angular dùng để làm gì?',
      options: ['Route guarding', 'Transform HTTP requests/responses globally', 'Form validation', 'Animation'],
      correctAnswer: 1,
      explanation: 'HTTP Interceptors cho phép modify requests/responses globally: add auth headers, handle errors, logging, caching.',
      category: 'services',
      difficulty: 'medium'
    }
  ];

  // Signals cho game state
  private _gameState = signal<GameState>({
    currentQuestionIndex: 0,
    score: 0,
    totalQuestions: 0,
    answeredQuestions: [],
    isFinished: false
  });

  private _shuffledQuestions = signal<Question[]>([]);
  private _selectedCategory = signal<string>('all');
  private _selectedDifficulty = signal<string>('all');

  // Public computed signals
  gameState = this._gameState.asReadonly();
  currentQuestion = computed(() => {
    const questions = this._shuffledQuestions();
    const index = this._gameState().currentQuestionIndex;
    return questions[index] || null;
  });

  progress = computed(() => {
    const state = this._gameState();
    return state.totalQuestions > 0
      ? Math.round((state.answeredQuestions.length / state.totalQuestions) * 100)
      : 0;
  });

  categories = computed(() => {
    const cats = [...new Set(this.questions.map(q => q.category))];
    return ['all', ...cats];
  });

  difficulties = ['all', 'easy', 'medium', 'hard'];

  startGame(category: string = 'all', difficulty: string = 'all', questionCount: number = 10): void {
    let filtered = [...this.questions];

    if (category !== 'all') {
      filtered = filtered.filter(q => q.category === category);
    }
    if (difficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === difficulty);
    }

    // Shuffle
    const shuffled = filtered.sort(() => Math.random() - 0.5).slice(0, questionCount);

    this._shuffledQuestions.set(shuffled);
    this._selectedCategory.set(category);
    this._selectedDifficulty.set(difficulty);
    this._gameState.set({
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: shuffled.length,
      answeredQuestions: [],
      isFinished: false
    });
  }

  answerQuestion(selectedIndex: number): boolean {
    const current = this.currentQuestion();
    if (!current) return false;

    const isCorrect = selectedIndex === current.correctAnswer;

    this._gameState.update(state => ({
      ...state,
      score: isCorrect ? state.score + 1 : state.score,
      answeredQuestions: [
        ...state.answeredQuestions,
        {
          questionId: current.id,
          selectedAnswer: selectedIndex,
          isCorrect
        }
      ]
    }));

    return isCorrect;
  }

  nextQuestion(): void {
    const state = this._gameState();
    const isLast = state.currentQuestionIndex >= state.totalQuestions - 1;

    this._gameState.update(s => ({
      ...s,
      currentQuestionIndex: isLast ? s.currentQuestionIndex : s.currentQuestionIndex + 1,
      isFinished: isLast
    }));
  }

  scoreMessage = computed(() => {
    const state = this._gameState();
    if (state.totalQuestions === 0) return '';
    const percentage = (state.score / state.totalQuestions) * 100;

    if (percentage === 100) return '🎉 Hoàn hảo! Bạn là Angular Master!';
    if (percentage >= 80) return '🔥 Xuất sắc! Kiến thức Angular rất vững!';
    if (percentage >= 60) return '👍 Khá tốt! Cần ôn thêm một chút nữa!';
    if (percentage >= 40) return '📚 Cố gắng hơn! Hãy review lại các concept!';
    return '💪 Đừng nản! Hãy học lại từ đầu và thử lại!';
  });

  resetGame(): void {
    this._gameState.set({
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: 0,
      answeredQuestions: [],
      isFinished: false
    });
    this._shuffledQuestions.set([]);
  }
}
