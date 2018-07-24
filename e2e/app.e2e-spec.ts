import { PDFToolAngularPage } from './app.po';

describe('pdftool-angular App', () => {
  let page: PDFToolAngularPage;

  beforeEach(() => {
    page = new PDFToolAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
