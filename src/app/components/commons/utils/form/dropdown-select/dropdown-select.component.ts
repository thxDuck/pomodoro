import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdown-select',
  imports: [],
  templateUrl: './dropdown-select.component.html',
  styleUrl: './dropdown-select.component.scss',
})
export class DropdownSelectComponent implements OnInit {
  ngOnInit(): void {
    for (let index = this.min; index <= this.max; index += this.step) {
      this.values.push(index);
    }
    
  }

  isOpen = false;
  @Input({ required: true }) min!: number;
  @Input({ required: true }) max!: number;
  @Input({ required: true }) step!: number;
  @Input({ required: true }) label!: string;
  @Input({ required: true }) unit!: string;
  @Input({ required: true }) value!: number;
  values: number[] = [];

  onScroll(list: HTMLElement) {
    const items = Array.from(list.querySelectorAll('li')).filter(
      el => !el.classList.contains('dropdown-select__spacer'),
    );

    let closestVal = this.values[0];
    let minDist = Number.POSITIVE_INFINITY;

    const centerY = list.getBoundingClientRect().top + list.clientHeight / 2;

    items.forEach((el, idx) => {
      const box = el.getBoundingClientRect();
      const dist = Math.abs(box.top + box.height / 2 - centerY);
      if (dist < minDist) {
        minDist = dist;
        closestVal = this.values[idx];
      }
    });

    this.value = closestVal;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    console.log(`toggleDropdown ${this.isOpen ? 'open' : 'closed'}`);
  }
}
