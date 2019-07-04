/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    FileName: ComponentFramework.PropertyTypes.StringProperty;
    FileSize: ComponentFramework.PropertyTypes.WholeNumberProperty;
    FileContent: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    FileName?: string;
    FileSize?: number;
    FileContent?: string;
}
