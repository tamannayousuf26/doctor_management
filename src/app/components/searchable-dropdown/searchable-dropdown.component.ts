// @ts-nocheck
import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef, forwardRef } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { MatFormFieldAppearance } from "@angular/material/form-field";

export interface DropdownOption {
  id: number | string;
  name: string;
  secondaryText?: string;
}

@Component({
  selector: "app-searchable-dropdown",
  templateUrl: "./searchable-dropdown.component.html",
  styleUrls: ["./searchable-dropdown.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableDropdownComponent),
      multi: true,
    },
  ],
})
export class SearchableDropdownComponent implements OnInit, ControlValueAccessor {
  @Input() options: DropdownOption[] = [];
  @Input() label: string = "Select an option";
  @Input() placeholder: string = "Search...";
  @Input() appearance: MatFormFieldAppearance = "outline";
  @Output() optionSelected = new EventEmitter<DropdownOption>();

  @ViewChild('searchInput') searchInput: ElementRef;

  filteredOptions: DropdownOption[] = [];
  selectedValue: any = null;
  searchText: string = "";

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    this.filteredOptions = this.options;
  }

  ngOnChanges(): void {
    this.filteredOptions = this.options;
  }

  onSearchKeyup(event: KeyboardEvent): void {
    const searchValue = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchText = searchValue;

    if (!searchValue) {
      this.filteredOptions = this.options;
      return;
    }

    this.filteredOptions = this.options.filter(
      (option) =>
        option.name.toLowerCase().includes(searchValue) ||
        (option.secondaryText &&
          option.secondaryText.toLowerCase().includes(searchValue))
    );
  }

  onSelectionChange(selectedId: any): void {
    const selectedOption = this.options.find((opt) => opt.id === selectedId);
    if (selectedOption) {
      this.optionSelected.emit(selectedOption);
    }
    this.onChange(selectedId);
    this.onTouched();
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Can be implemented if needed
  }

  onOpenedChange(opened: boolean): void {
    if (opened) {
      this.searchText = "";
      this.filteredOptions = this.options;
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.value = "";
          this.searchInput.nativeElement.focus();
        }
      }, 100);
    }
  }

  getDisplayText(option: DropdownOption): string {
    if (option.secondaryText) {
      return `${option.name}  (${option.secondaryText})`;
    }
    return option.name;
  }
}
