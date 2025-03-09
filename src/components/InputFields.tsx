import { FormControl, FormMessage, FormLabel, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Control } from "react-hook-form";
type InputFieldsProps = {
    type: string;
    label: string;
    name: string;
    control: Control<any>;
    placeholder?: string;
    defaultValue?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function InputFields({ type, label, placeholder, defaultValue, control, name, onChange, value }: InputFieldsProps) {
    return (
        <div className="flex flex-col gap-2 w-full md:w-1/4">
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input type={type} placeholder={placeholder} {...field} defaultValue={defaultValue} value={value} onChange={onChange} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
