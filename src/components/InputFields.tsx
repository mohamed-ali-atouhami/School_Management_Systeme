import { FormControl, FormMessage, FormLabel, FormField, FormItem } from "./ui/form";
import { Input } from "./ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

type InputFieldsProps<T extends FieldValues = FieldValues> = {
    type?: string;
    label: string;
    name: Path<T>;
    control: Control<T>;
    placeholder?: string;
    hidden?: boolean;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputFields<T extends FieldValues = FieldValues>({ type, label, placeholder, control, name, hidden }: InputFieldsProps<T>) {
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
