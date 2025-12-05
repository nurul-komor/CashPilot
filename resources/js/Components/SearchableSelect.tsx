import { Combobox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronsUpDownIcon, PlusIcon } from 'lucide-react';
import { Fragment, useState } from 'react';

interface SearchableSelectOption {
    id: number | string;
    name: string;
    [key: string]: any;
}

interface SearchableSelectProps {
    options: SearchableSelectOption[];
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    label?: string;
    error?: string;
    onCreateNew?: (name: string) => Promise<SearchableSelectOption>;
    createLabel?: string;
    displayValue?: (option: SearchableSelectOption) => string;
    filterBy?: (option: SearchableSelectOption, query: string) => boolean;
    required?: boolean;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Search...',
    label,
    error,
    onCreateNew,
    createLabel = 'Create',
    displayValue = (option) => option.name,
    filterBy = (option, query) =>
        option.name.toLowerCase().includes(query.toLowerCase()),
    required = false,
}: SearchableSelectProps) {
    const [query, setQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const selectedOption = value !== null && value !== ''
        ? options.find(opt => opt.id.toString() === value.toString())
        : null;

    const filteredOptions = query === ''
        ? options
        : options.filter((option) => filterBy(option, query));

    const showCreateOption = onCreateNew && query !== '' &&
        !options.some(opt => opt.name.toLowerCase() === query.toLowerCase().trim());

    const handleCreateNew = async () => {
        if (!onCreateNew || !query.trim()) return;

        setIsCreating(true);
        setCreateError(null);

        try {
            const newOption = await onCreateNew(query.trim());
            onChange(newOption.id);
            setQuery('');
        } catch (err: any) {
            setCreateError(err.response?.data?.message || 'Failed to create item');
        } finally {
            setIsCreating(false);
        }
    };

    const handleOptionChange = (option: SearchableSelectOption | null) => {
        onChange(option?.id || null);
        setQuery(''); // Clear query when selection is made
    };

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <Combobox value={selectedOption || null} onChange={handleOptionChange}>
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-300 bg-white text-left shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-500 sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(option: SearchableSelectOption | null) => {
                                if (query) {
                                    return query;
                                }
                                return option ? displayValue(option) : '';
                            }}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={selectedOption ? undefined : placeholder}
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronsUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredOptions.length === 0 && query !== '' && !showCreateOption ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                <>
                                    {showCreateOption && (
                                        <div
                                            className="relative cursor-pointer select-none px-4 py-2 text-indigo-600 hover:bg-indigo-50 flex items-center gap-2"
                                            onClick={handleCreateNew}
                                        >
                                            <PlusIcon className="h-4 w-4" />
                                            <span>
                                                {createLabel} "{query}"
                                            </span>
                                            {isCreating && (
                                                <span className="ml-auto text-xs text-gray-500">Creating...</span>
                                            )}
                                        </div>
                                    )}
                                    {filteredOptions.map((option) => (
                                        <Combobox.Option
                                            key={option.id}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                    active ? 'bg-indigo-600 text-white' : 'text-gray-900'
                                                }`
                                            }
                                            value={option}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected ? 'font-medium' : 'font-normal'
                                                        }`}
                                                    >
                                                        {displayValue(option)}
                                                    </span>
                                                    {selected ? (
                                                        <span
                                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                                active ? 'text-white' : 'text-indigo-600'
                                                            }`}
                                                        >
                                                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ))}
                                </>
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
            {createError && (
                <p className="mt-1 text-sm text-red-600">{createError}</p>
            )}
            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

