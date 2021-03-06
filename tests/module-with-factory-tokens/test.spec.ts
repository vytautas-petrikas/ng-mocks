import { VERSION } from '@angular/core';
import { MockBuilder, MockRender } from 'ng-mocks';

import { MY_TOKEN_MULTI, MY_TOKEN_SINGLE, TargetComponent, TargetModule } from './fixtures';

// Because all tokens have factories the test should render them correctly.
// There's no way to specify multi in a factory, so we don't get an array.
describe('module-with-factory-tokens:real', () => {
  beforeEach(() => MockBuilder().keep(TargetModule));

  it('renders all tokens', () => {
    if (parseInt(VERSION.major, 10) <= 5) {
      pending('Need Angular > 5');
      return;
    }

    const fixture = MockRender(TargetComponent);
    expect(fixture.nativeElement.innerHTML).toEqual(
      '<internal-component>"MY_TOKEN_SINGLE" "MY_TOKEN_MULTI"</internal-component>'
    );
  });
});

// Because all tokens are kept the test should render them correctly.
// There's no way to specify multi in a factory, so we don't get an array.
describe('module-with-factory-tokens:keep', () => {
  beforeEach(() => MockBuilder(TargetComponent, TargetModule).keep(MY_TOKEN_SINGLE).keep(MY_TOKEN_MULTI));

  it('renders all tokens', () => {
    if (parseInt(VERSION.major, 10) <= 5) {
      pending('Need Angular > 5');
      return;
    }

    const fixture = MockRender(TargetComponent);
    expect(fixture.nativeElement.innerHTML).toEqual(
      '<internal-component>"MY_TOKEN_SINGLE" "MY_TOKEN_MULTI"</internal-component>'
    );
  });
});

// Preferred way.
// Because tokens are provided in the testbed module with custom values the test should render them.
describe('module-with-factory-tokens:mock-0', () => {
  beforeEach(() =>
    MockBuilder(TargetComponent, TargetModule)
      .provide({
        provide: MY_TOKEN_SINGLE,
        useValue: 'V1',
      })
      .provide({
        multi: true,
        provide: MY_TOKEN_MULTI,
        useValue: 'V2',
      })
  );

  it('fails to render all tokens', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toContain('"V1" [ "V2" ]');
  });
});

// Because all tokens are mocked in the module the test should render empty values.
// The tokens will be added to provides with undefined values.
// Result of the render is an empty string because there's no way to pass multi.
describe('module-with-factory-tokens:mock-1', () => {
  beforeEach(() => MockBuilder(TargetComponent, TargetModule).mock(MY_TOKEN_SINGLE).mock(MY_TOKEN_MULTI));

  it('renders all tokens', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.nativeElement.innerHTML.replace(/\s+/gm, ' ')).toEqual('<internal-component> </internal-component>');
  });
});

// Because all tokens are mocked with custom values the test should render them.
// There's no way to specify multi in a factory, so we don't get an array.
describe('module-with-factory-tokens:mock-2', () => {
  beforeEach(() =>
    MockBuilder(TargetComponent, TargetModule)
      .mock(MY_TOKEN_SINGLE, 'MOCKED_MY_TOKEN_SINGLE')
      .mock(MY_TOKEN_MULTI, 'MOCKED_MY_TOKEN_MULTI')
  );

  it('renders all tokens', () => {
    const fixture = MockRender(TargetComponent);
    expect(fixture.nativeElement.innerHTML).toEqual(
      '<internal-component>"MOCKED_MY_TOKEN_SINGLE" "MOCKED_MY_TOKEN_MULTI"</internal-component>'
    );
  });
});

// And the most interesting case. Because we don't touch tokens at all and mock the module
// the tokens will used as they are with their factories.
// Unfortunately it's quite tough to guess which tokens we can keep, mocks or omit and now
// a user is responsible to specify tokens for his mock.
describe('module-with-factory-tokens:mock-3', () => {
  beforeEach(() => MockBuilder(TargetComponent, TargetModule));

  it('renders all tokens', () => {
    if (parseInt(VERSION.major, 10) <= 5) {
      pending('Need Angular > 5');
      return;
    }

    const fixture = MockRender(TargetComponent);
    expect(fixture.nativeElement.innerHTML).toEqual(
      '<internal-component>"MY_TOKEN_SINGLE" "MY_TOKEN_MULTI"</internal-component>'
    );
  });
});
