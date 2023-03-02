import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  PoBreadcrumb,
  PoCheckboxGroupOption,
  PoModalAction,
  PoModalComponent,
  PoMultiselectOption,
  PoPageAction,
  PoPageFilter,
  PoPageListComponent,
  PoTableColumn,
  PoDisclaimerGroup,
  PoDisclaimer,
} from '@po-ui/ng-components';

import { OrderFilter } from './order-filter';
import { OrderMonitorFilterComponent } from './order-filter.component';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild(OrderMonitorFilterComponent, { static: false })
  advancedFilterModal: PoModalComponent;
  @ViewChild('poPageList', { static: true }) poPageList: PoPageListComponent;

  disclaimerGroup: PoDisclaimerGroup;
  hiringProcesses: Array<object>;
  hiringProcessesColumns: Array<PoTableColumn>;
  hiringProcessesFiltered: Array<object>;
  jobDescription: Array<string> = [];
  jobDescriptionOptions: Array<PoMultiselectOption>;
  labelFilter: string = '';
  status: Array<string> = [];
  statusOptions: Array<PoCheckboxGroupOption>;
  appliedFilter: OrderFilter;

  hero: string = '';
  filters: OrderFilter = new OrderFilter();
  optionsWaiting: PoCheckboxGroupOption[];
  optionsExecuting: PoCheckboxGroupOption[];
  optionsExecuted: PoCheckboxGroupOption[];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [
      { label: 'Home', action: this.beforeRedirect.bind(this) },
      { label: 'Hiring processes' },
    ],
  };

  public advancedFilterPrimaryAction: PoModalAction = {
    action: () => {
      this.poPageList.clearInputSearch();
      this.advancedFilterModal.close();
    },
    label: 'Aplicar filters',
  };

  public readonly filterSettings: PoPageFilter = {
    action: this.filterAction.bind(this),
    advancedAction: this.advancedFilterActionModal.bind(this),
    placeholder: 'Search',
  };

  private disclaimers = [];
  liberaLookup: boolean;

  constructor(private router: Router) {
    this.optionsWaiting = [
      { label: 'pending', value: '1' },
      { label: 'execution-limit', value: '2' },
    ];

    this.optionsExecuting = [
      { label: 'starting-request', value: '3' },
      { label: 'executing', value: '4' },
    ];

    this.optionsExecuted = [
      { label: 'request-error', value: '5' },
      { label: 'execution-error', value: '6' },
    ];
  }

  ngOnInit() {
    this.disclaimerGroup = {
      title: 'Filters',
      disclaimers: [],
      change: this.onChangeDisclaimer.bind(this),
      remove: this.onClearDisclaimer.bind(this),
    };

    this.hiringProcesses = this.getItems();
    this.hiringProcessesColumns = this.getColumns();
    this.jobDescriptionOptions = this.getJobs();
    this.statusOptions = this.getHireStatus();
    this.hiringProcessesFiltered = [...this.hiringProcesses];
    this.filters = new OrderFilter();
  }

  advancedFilterActionModal() {
    this.advancedFilterModal.open();
  }

  filter() {
    const filters = this.disclaimers.map((disclaimer) => disclaimer.value);
    filters.length
      ? this.hiringProcessesFilter(filters)
      : this.resetFilterHiringProcess();
  }

  hiringProcessesFilter(filters) {
    this.hiringProcessesFiltered = this.hiringProcesses.filter((item) =>
      Object.keys(item).some(
        (key) =>
          !(item[key] instanceof Object) &&
          this.includeFilter(item[key], filters)
      )
    );
  }

  includeFilter(item, filters) {
    return filters.some((filter) =>
      String(item).toLocaleLowerCase().includes(filter.toLocaleLowerCase())
    );
  }

  onClearDisclaimer(disclaimers) {
    console.log('onClearDisclaimer:');
    if (disclaimers.removedDisclaimer.property === 'search') {
      this.poPageList.clearInputSearch();
    }
    this.disclaimers = [];
    this.hero = '';
    this.filter();
  }

  resetFilterHiringProcess() {
    this.hiringProcessesFiltered = [...this.hiringProcesses];
    this.status = [];
    this.jobDescription = [];
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.hiringProcesses.some((candidate) => candidate['$selected'])) {
      console.log('clicou no breadcrumb');
    } else {
      this.router.navigate(['/']);
    }
  }

  getColumns(): Array<PoTableColumn> {
    return [
      {
        property: 'hireStatus',
        label: 'Status',
        type: 'subtitle',
        subtitles: [
          { value: 'hired', color: 'success', label: 'Hired', content: '1' },
          {
            value: 'progress',
            color: 'warning',
            label: 'Progress',
            content: '2',
          },
          {
            value: 'canceled',
            color: 'danger',
            label: 'Canceled',
            content: '3',
          },
        ],
      },
      { property: 'idCard', label: 'Identity card', type: 'string' },
      { property: 'name', label: 'Name' },
      { property: 'age', label: 'Age' },
      { property: 'city', label: 'City' },
      { property: 'jobDescription', label: 'Job description', type: 'string' },
    ];
  }

  getHireStatus() {
    return [
      { value: 'hired', label: 'Hired' },
      { value: 'progress', label: 'Progress' },
      { value: 'canceled', label: 'Canceled' },
    ];
  }

  getItems() {
    return [
      {
        hireStatus: 'hired',
        name: 'James Johnson',
        city: 'Ontario',
        age: 24,
        idCard: 'AB34lxi90',
        jobDescription: 'Systems Analyst',
      },
      {
        hireStatus: 'progress',
        name: 'Brian Brown',
        city: 'Buffalo',
        age: 23,
        idCard: 'HG56lds54',
        jobDescription: 'Trainee',
      },
      {
        hireStatus: 'canceled',
        name: 'Mary Davis',
        city: 'Albany',
        age: 31,
        idCard: 'DF23cfr65',
        jobDescription: 'Programmer',
      },
      {
        hireStatus: 'hired',
        name: 'Margaret Garcia',
        city: 'New York',
        age: 29,
        idCard: 'GF45fgh34',
        jobDescription: 'Web developer',
      },
      {
        hireStatus: 'hired',
        name: 'Emma Hall',
        city: 'Ontario',
        age: 34,
        idCard: 'RF76jut21',
        jobDescription: 'Recruiter',
      },
      {
        hireStatus: 'progress',
        name: 'Lucas Clark',
        city: 'Utica',
        age: 32,
        idCard: 'HY21kgu65',
        jobDescription: 'Consultant',
      },
      {
        hireStatus: 'hired',
        name: 'Ella Scott',
        city: 'Ontario',
        age: 24,
        idCard: 'UL78flg68',
        jobDescription: 'DBA',
      },
      {
        hireStatus: 'progress',
        name: 'Chloe Walker',
        city: 'Albany',
        age: 29,
        idCard: 'JH12oli98',
        jobDescription: 'Programmer',
      },
    ];
  }

  getJobs() {
    return [
      { value: 'Systems Analyst', label: 'Systems Analyst' },
      { value: 'Trainee', label: 'Trainee' },
      { value: 'Programmer', label: 'Programmer' },
      { value: 'Web Developer', label: 'Web developer' },
      { value: 'Recruiter', label: 'Recruiter' },
      { value: 'Consultant', label: 'Consultant' },
      { value: 'DBA', label: 'DBA' },
    ];
  }

  private disclaimerToFilter(disclaimers: PoDisclaimer[]): OrderFilter {
    let filter: OrderFilter = new OrderFilter();

    filter.situationReason = [];

    disclaimers.forEach((disclaimer: PoDisclaimer) => {
      if (disclaimer.property === 'situationReason') {
        filter[disclaimer.property].push(disclaimer.value);
      } else {
        filter[disclaimer.property] = disclaimer.value;
      }
    });

    return filter;
  }

  private onChangeDisclaimer(disclaimers: PoDisclaimer[]): void {
    console.log('onChangeDisclaimer');
    let filter: OrderFilter;
    filter = this.disclaimerToFilter(disclaimers);

    this.appliedFilter = filter;
    this.filter();
  }

  public advancedFilterAction(): void {
    this.advancedFilterModal.open();
  }

  public filterAction(quickSearch: string): void {
    if (quickSearch && quickSearch.length > 0) {
      this.reloadDisclaimers('quick', quickSearch);
    } else {
      this.filter();
    }
  }

  public applyAdvancedFilter(filter: OrderFilter): void {
    this.appliedFilter = filter;
    this.reloadDisclaimers('advanced', filter);
  }

  private reloadDisclaimers(filterType: string, filter?: any): void {
    let disclaimers: PoDisclaimer[] = [];

    if (filterType === 'quick') {
      disclaimers.push({
        label: 'Execution request:',
        value: filter,
        property: 'numPedExec',
      });
    }

    if (filterType === 'advanced') {
      disclaimers = this.filterToDisclaimers(filter as OrderFilter);
    }

    this.disclaimerGroup.disclaimers = disclaimers;
  }

  public filterToDisclaimers(filter: OrderFilter): PoDisclaimer[] {
    let disclaimers: PoDisclaimer[] = new Array<PoDisclaimer>();

    if (filter.programCode) {
      disclaimers.push({
        label: `Programa: ${filter.programCode}`,
        property: 'programCode',
        value: filter.programCode,
      });
    }

    if (filter.situationReason) {
      filter.situationReason.forEach((reason: string) => {
        disclaimers.push({
          label: `${'Situation'}: ${reason}`,
          property: 'situationReason',
          value: reason,
        });
      });
    }

    return disclaimers;
  }

  /*
  changeLookup() {
    console.log('event changeLookup');
    this.advancedFilterPrimaryAction.disabled = false;
  }  

  onKeyDown() {
    if (!this.liberaLookup) {
      this.advancedFilterPrimaryAction.disabled = true;
    }
  }
  */

  /*
  populateDisclaimers(filters: Array<any>) {
    const property = filters.length > 1 ? 'advanced' : 'search';
    this.disclaimers = filters.map((value) => ({ value, property }));

    if (this.disclaimers && this.disclaimers.length > 0) {
      this.disclaimerGroup.disclaimers = [...this.disclaimers];
    } else {
      this.disclaimerGroup.disclaimers = [];
    }
  }
  */
}
