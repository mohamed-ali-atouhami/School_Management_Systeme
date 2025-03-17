import { FormControl, FormMessage, FormLabel, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Control } from "react-hook-form";
type InputFieldsProps = {
    type?: string;
    label: string;
    name: string;
    control: Control<any>;
    placeholder?: string;
    hidden?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function InputFields({ type, label, placeholder, control, name, hidden }: InputFieldsProps) {
    return (
        <div className={hidden ? "hidden" : "flex flex-col gap-2 w-full md:w-1/4"}>
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>{label}</FormLabel>
                        <FormControl>
                            <Input type={type} placeholder={placeholder} {...field} hidden={hidden} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
