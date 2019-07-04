import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class TestComponent implements ComponentFramework.StandardControl<IInputs, IOutputs> {


    private _fileElement: HTMLInputElement;
    private _submitButton: HTMLElement;
    private _breakElement: HTMLElement;

    private _fileName: string;
    private _fileSize: number;
    private _fileContent: string;

    private _submitClicked: EventListenerOrEventListenerObject;
    private _fileChanged: EventListenerOrEventListenerObject;

    private _context: ComponentFramework.Context<IInputs>;
    private _notifyOutputChanged: () => void;
    private _container: HTMLDivElement;


	/**
	 * Empty constructor.
	 */
    constructor() {

    }

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        // assigning environment variables. 
        this._context = context;
        this._notifyOutputChanged = notifyOutputChanged;
        this._container = container;


        // register eventhandler functions 
        this._submitClicked = this.submitClick.bind(this);
        this._fileChanged = this.fileChanged.bind(this);


        // file control 
        this._fileElement = document.createElement("input");
        this._fileElement.setAttribute("type", "file");
        this._fileElement.addEventListener("change", this._fileChanged);



        // break (<br/>) element 
        this._breakElement = document.createElement("br");


        // submit button 
        this._submitButton = document.createElement("input");
        this._submitButton.setAttribute("type", "button");
        this._submitButton.setAttribute("value", "Submit");
        this._submitButton.addEventListener("click", this._submitClicked);


        // finally add to the container so that it renders on the UI. 
        this._container.appendChild(this._fileElement);
        this._container.appendChild(this._breakElement);
        this._container.appendChild(this._submitButton);
    }


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        debugger;


        // CRM attributes bound to the control properties. 
        // @ts-ignore 
        var crmFileNameAttr = this._context.parameters.FileName.attributes.LogicalName;


        // @ts-ignore 
        var crmFileSizeAttr = this._context.parameters.FileSize.attributes.LogicalName;
        // setting CRM field values here. 
        // @ts-ignore 
        Xrm.Page.getAttribute(crmFileNameAttr).setValue(this._context.parameters.FileName.formatted);


        // @ts-ignore 
        Xrm.Page.getAttribute(crmFileSizeAttr).setValue(this._context.parameters.FileSize.formatted); 

    }

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
    public getOutputs(): IOutputs {
        return {
            FileName: this._fileName,
            FileSize: this._fileSize,
            FileContent: this._fileContent
        }; 
    }

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
    public destroy(): void {
        // remove the event handlers. 
        this._fileElement.removeEventListener("change", this._fileChanged);
        this._submitButton.removeEventListener("click", this._submitClicked); 
    }

    // event handlers 
    public fileChanged(evt: Event): void {
        var files = this._fileElement.files;


        if (files != null && files.length > 0) {
            var file = files[0];


            var fileName = file.name;
            var fileSize = file.size;

            this._fileName = fileName;
            this._fileSize = fileSize;


            // this will call the getOutputs method. 
            this._notifyOutputChanged();
        }
    }

    public submitClick(evt: Event): void {
        debugger;
        // do your file processing here 
        var files = this._fileElement.files;


        if (files != null && files.length > 0) {
            var file = files[0];


            var fileSize = file.size;


            if (fileSize > 1048576) {
                // you can alert here…for brevity showing Xrm.Utility..you should use Xrm.Navigation 
                // @ts-ignore 
                Xrm.Utility.alertDialog("File size should be less than 1 MB");
                this._fileName = "";
                this._fileSize = 0;


                this._notifyOutputChanged();
            }
        }
    } 
}