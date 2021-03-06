import { MockBuilder, MockDirective, MockedDirective, MockRender, ngMocks } from 'ng-mocks';

import { CustomNgForWithOfDirective } from './custom-ng-for-with-of.directive';
import { CustomNgForWithoutOfDirective } from './custom-ng-for-without-of.directive';
import { CustomNgIfDirective } from './custom-ng-if.directive';

describe('structural-directive-as-ng-for:real', () => {
  beforeEach(() =>
    MockBuilder().keep(CustomNgForWithOfDirective).keep(CustomNgForWithoutOfDirective).keep(CustomNgIfDirective)
  );

  it('renders customNgForWithOf properly', () => {
    // should iterate against 3 string.
    const fixture = MockRender(
      `
        <div data-type="customNgForWithOf"
          *customNgForWithOf="let v of values; let i = myIndex; let f = myFirst; let l = myLast;"
        >w/ {{v}}{{i}}{{f ? 1 : 0}}{{l ? 1 : 0}}</div>
      `,
      {
        values: ['string1', 'string2', 'string3'],
      }
    );

    // every value should be rendered correctly.
    expect(fixture.nativeElement.innerHTML).toContain('<div data-type="customNgForWithOf">w/ string1010</div>');
    expect(fixture.nativeElement.innerHTML).toContain('<div data-type="customNgForWithOf">w/ string2100</div>');
    expect(fixture.nativeElement.innerHTML).toContain('<div data-type="customNgForWithOf">w/ string3201</div>');
  });

  it('renders customNgForWithoutOf properly', () => {
    // should iterate against 3 string.
    const fixture = MockRender(
      `
        <div data-type="customNgForWithoutOf"
          *customNgForWithoutOf="values; let v; let i = myIndex; let f = myFirst; let l = myLast;"
        >w/o {{v}}{{i}}{{f ? 1 : 0}}{{l ? 1 : 0}}</div>
      `,
      {
        values: ['string1', 'string2', 'string3'],
      }
    );

    // every value should be rendered correctly.
    expect(fixture.nativeElement.innerHTML).toContain('<div data-type="customNgForWithoutOf">w/o string1010</div>');
    expect(fixture.nativeElement.innerHTML).toContain('<div data-type="customNgForWithoutOf">w/o string2100</div>');
    expect(fixture.nativeElement.innerHTML).toContain('<div data-type="customNgForWithoutOf">w/o string3201</div>');
  });

  it('renders customNgIf properly', () => {
    // should display just first part.
    const fixture = MockRender(
      `
        <div data-type="customNgIfTrue" *customNgIf="values">should be shown</div>
        <div data-type="customNgIfFalse" *customNgIf="!values">should be hidden</div>
      `,
      {
        values: ['string1', 'string2', 'string3'],
      }
    );

    // only first div should be rendered.
    expect(fixture.nativeElement.innerHTML).toContain('<div data-type="customNgIfTrue">should be shown</div>');
    expect(fixture.nativeElement.innerHTML).not.toContain('<div data-type="customNgIfFalse">should be hidden</div>');
  });
});

describe('structural-directive-as-ng-for:mock', () => {
  beforeEach(() =>
    MockBuilder().mock(CustomNgIfDirective).mock(CustomNgForWithOfDirective).mock(CustomNgForWithoutOfDirective)
  );

  it('mocks customNgIf properly', () => {
    const fixture = MockRender(
      `
        <div data-type="customNgIfTrue" *customNgIf="values;let data;let randomParam = fromDirective">
          $implicit:{{ data | json }}
          fromDirective:{{ randomParam | json }}
        </div>
      `,
      {
        values: ['string1', 'string2', 'string3'],
      }
    );

    // we need to render mocked structural directives manually
    ngMocks
      .findInstances(fixture.debugElement, CustomNgIfDirective)
      .forEach((item: MockedDirective<CustomNgIfDirective>) =>
        item.__render(undefined, {
          fromDirective: undefined,
        })
      );
    fixture.detectChanges();

    // By default mocked structural directives are rendered with undefined variables.
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' $implicit: fromDirective: ');

    // Extracting mock.
    const debugElement = ngMocks.find(fixture.debugElement, 'div');
    const directive = ngMocks.get(debugElement, MockDirective(CustomNgIfDirective));
    expect(directive).toBeTruthy();
    if (!directive) {
      return;
    }

    // Assert that mock got right variables.
    expect(directive.setValue).toEqual(['string1', 'string2', 'string3']);

    // Now we want to assert how our html is rendered based on structural directive variables' definition.
    directive.__render(true, {
      fromDirective: false,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' $implicit:true fromDirective:false ');

    // And we want dynamically change variables for render.
    directive.__render(false, {
      fromDirective: true,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' $implicit:false fromDirective:true ');
  });

  it('mocks CustomNgForWithOfDirective properly', () => {
    const fixture = MockRender(
      `
        <div data-type="customNgForWithOf"
          *customNgForWithOf="let v of values; let i = myIndex; let f = myFirst; let l = myLast;"
        >
          w/ {{v}}{{i}}{{f ? 1 : 0}}{{l ? 1 : 0}}
        </div>
      `,
      {
        values: ['string1', 'string2', 'string3'],
      }
    );

    // we need to render mocked structural directives manually
    ngMocks
      .findInstances(fixture.debugElement, CustomNgForWithOfDirective)
      .forEach((item: MockedDirective<CustomNgForWithOfDirective>) => item.__render());
    fixture.detectChanges();

    // By default mocked structural directives are rendered with undefined variables.
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' w/ 00 ');

    const debugElement = ngMocks.find(fixture.debugElement, 'div');

    // Extracting mock.
    const directive = ngMocks.get(debugElement, MockDirective(CustomNgForWithOfDirective));
    expect(directive).toBeTruthy();
    if (!directive) {
      return;
    }

    // Assert that mock got right variables.
    expect(directive.setItems).toEqual(['string1', 'string2', 'string3']);

    // Now we want to assert how our html is rendered based on structural directive variables' definition.
    directive.__render('MainValue', {
      myFirst: true,
      myIndex: 'MyIndex',
      myLast: false,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' w/ MainValueMyIndex10 ');

    // And we want dynamically change variables for render.
    directive.__render('MainValue2', {
      myFirst: false,
      myIndex: 'MyIndex2',
      myLast: true,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' w/ MainValue2MyIndex201 ');
  });

  it('mocks customNgForWithoutOf properly', () => {
    const fixture = MockRender(
      `
        <div data-type="customNgForWithoutOf"
          *customNgForWithoutOf="values; let v; let i = myIndex; let f = myFirst; let l = myLast;"
        >
          w/o {{v}}{{i}}{{f ? 1 : 0}}{{l ? 1 : 0}}
        </div>
      `,
      {
        values: ['string1', 'string2', 'string3'],
      }
    );

    // we need to render mocked structural directives manually
    ngMocks
      .findInstances(fixture.debugElement, CustomNgForWithoutOfDirective)
      .forEach((item: MockedDirective<CustomNgForWithoutOfDirective>) => item.__render());
    fixture.detectChanges();

    // By default mocked structural directives are rendered with undefined variables.
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' w/o 00 ');

    const debugElement = ngMocks.find(fixture.debugElement, 'div');

    // Extracting mock.
    const directive = ngMocks.get(debugElement, MockDirective(CustomNgForWithoutOfDirective));
    expect(directive).toBeTruthy();
    if (!directive) {
      return;
    }

    // Assert that mock got right variables.
    expect(directive.setItems).toEqual(['string1', 'string2', 'string3']);

    // Now we want to assert how our html is rendered based on structural directive variables' definition.
    directive.__render('MainValue', {
      myFirst: true,
      myIndex: 'MyIndex',
      myLast: false,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' w/o MainValueMyIndex10 ');

    // And we want dynamically change variables for render.
    directive.__render('MainValue2', {
      myFirst: false,
      myIndex: 'MyIndex2',
      myLast: true,
    });
    fixture.detectChanges();
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain(' w/o MainValue2MyIndex201 ');
  });

  it('searches for related directive', () => {
    let mockedDirective: MockedDirective<CustomNgForWithoutOfDirective> | undefined;

    const fixture = MockRender(
      `
        <div data-type="node-1"
          *customNgForWithoutOf="values1; let v; let i = myIndex; let f = myFirst; let l = myLast;"
        >
          w/o {{v}}{{i}}{{f ? 1 : 0}}{{l ? 1 : 0}}
        </div>
        <div data-type="node-2"
          *customNgForWithoutOf="values2; let v; let i = myIndex; let f = myFirst; let l = myLast;"
        >
          w/o {{v}}{{i}}{{f ? 1 : 0}}{{l ? 1 : 0}}
        </div>
      `,
      {
        values1: ['string1', 'string2', 'string3'],
        values2: ['string4', 'string5', 'string6'],
      }
    );

    // we need to render mocked structural directives manually
    ngMocks
      .findInstances(fixture.debugElement, CustomNgForWithOfDirective)
      .forEach((item: MockedDirective<CustomNgForWithOfDirective>) => item.__render());
    ngMocks
      .findInstances(fixture.debugElement, CustomNgForWithoutOfDirective)
      .forEach((item: MockedDirective<CustomNgForWithoutOfDirective>) => item.__render());
    fixture.detectChanges();

    // Looking for first directive.
    mockedDirective = ngMocks.get(
      ngMocks.find(fixture.debugElement, '[data-type="node-1"]'),
      MockDirective(CustomNgForWithoutOfDirective)
    );
    expect(mockedDirective.setItems).toEqual(['string1', 'string2', 'string3']);

    // Looking for second directive.
    mockedDirective = ngMocks.get(
      ngMocks.find(fixture.debugElement, '[data-type="node-2"]'),
      MockDirective(CustomNgForWithoutOfDirective)
    );
    expect(mockedDirective.setItems).toEqual(['string4', 'string5', 'string6']);
  });
});
