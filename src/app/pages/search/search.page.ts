import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLinkExtension } from 'src/app/extensions/router-link';
import { SearchExtension } from 'src/app/extensions/search';
import { CompBase } from 'src/app/fw/bases/comp/comp.base';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage extends CompBase implements AfterViewInit {

  q: string = "";
  histories: string[] = [];

  constructor(
    public searchExt: SearchExtension,
    public routerLinkExt: RouterLinkExtension,
    protected router: Router,
    protected override injector: Injector,
    public override cdRef: ChangeDetectorRef
  ) {
    super(injector, cdRef);
  }

  ngAfterViewInit() {
    this.histories = this.searchExt.histories;

    this.visible = true;
    this.cdRef.detectChanges();

    this.subscription.add(this.searchExt.change$.subscribe(() => {
      this.cdRef.detectChanges();
    }));
  }

  onClearHistory() {
    this.getMessageExt().confirm({
      message: this.lang("Stai cancellando tutta la cronologia delle ricerche"),
      success: () => {
        this.searchExt.clearHistory();
        this.cdRef.detectChanges();
      }
    });
  }

  async onSearch(q: string) {
    q = q.trim();

    if (!q) {
      this.getMessageExt().toast(this.lang("Inserisci la parola chiave"));
      return;
    }

    await this.router.navigateByUrl(this.routerLinkExt.normalize(
      this.routerLinkExt.getRouterLink([this.language, "searches"]),
      {
        q: q
      }
    ));

    this.searchExt.push(q);
  }

}
