import { ElementRef } from '@angular/core'

declare var M: { 
    Modal: { init: (arg0: any) => any }
    toast: (arg0: { html: string }) => void; 
    FloatingActionButton: { init: (ref:ElementRef, options: any) => void } 
    updateTextFields: () => void
    Tooltip: { init: (arg0: any) => MaterialInstance }
    Datepicker: any//{ init: (arg0: any, arg1: { format: string; showClearBtn: boolean; onClose: () => void }) => MaterialDatePicker }
    TapTarget: { init: (arg0: any) => MaterialInstance }
}

export interface MaterialInstance {
    open?(): void
    close?(): void
    destroy?(): void
}

export interface MaterialDatePicker extends MaterialInstance {
    date?: Date
}

export class MaterialService {
    static toast (message: string) {
        M.toast({html: message})
    }

    static initializeFloatingButton(ref: ElementRef){
        M.FloatingActionButton.init(
            ref.nativeElement, 
            {
            direction: 'left',
            hoverEnabled: false
            })
    }
    static updateTextInputs(){
        M.updateTextFields()
    }
    static initModal(ref:ElementRef): MaterialInstance {
        return M.Modal.init(ref.nativeElement)
    }
    static initToolTip(ref:ElementRef):MaterialInstance{
        return M.Tooltip.init(ref.nativeElement)
    }
    static initDatepicker(ref:ElementRef, onClose: () => void ): MaterialDatePicker {
        return M.Datepicker.init(ref.nativeElement, {
            format: "dd.mm.yyyy",
            showClearBtn: true,
            onClose
        })
    }
    static initTapTarget (ref:ElementRef): MaterialInstance{
        return M.TapTarget.init(ref.nativeElement)
    }
}