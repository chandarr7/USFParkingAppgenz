import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, Search, RefreshCw, Info, Filter, SortAsc, SortDesc } from "lucide-react";

interface DataTableProps<T extends { id: number }> {
  data: T[];
  columns: ColumnDef<T>[];
  title: string;
  schema: z.ZodObject<any>;
  onAdd: (data: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  onRefresh?: () => void;
  emptyMessage?: string;
}

interface ColumnDef<T> {
  id: string;
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (info: { row: T }) => React.ReactNode;
  sortable?: boolean;
}

enum DialogMode {
  None,
  Add,
  Edit,
  Delete
}

export function DataTable<T extends { id: number }>({ 
  data, 
  columns, 
  title,
  schema,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh,
  emptyMessage = "No results found."
}: DataTableProps<T>) {
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.None);
  const [selectedItem, setSelectedItem] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sorting, setSorting] = useState<{ column: string | null; direction: 'asc' | 'desc' | null }>({
    column: null,
    direction: null
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const handleOpenDialog = (mode: DialogMode, item?: T) => {
    setDialogMode(mode);
    setSelectedItem(item || null);
    
    if (mode === DialogMode.Edit && item) {
      // Convert item to form values
      const formValues: any = {};
      // Filter out only the properties that exist in the schema
      Object.keys(item).forEach(key => {
        // Skip id or other special properties that shouldn't be edited
        if (key !== 'id' && typeof (item as any)[key] !== 'undefined') {
          formValues[key] = (item as any)[key];
        }
      });
      form.reset(formValues);
    } else if (mode === DialogMode.Add) {
      form.reset({});
    }
  };

  const handleCloseDialog = () => {
    setDialogMode(DialogMode.None);
    setSelectedItem(null);
    form.reset();
  };

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    setIsProcessing(true);
    try {
      if (dialogMode === DialogMode.Add) {
        await onAdd(values);
        toast({
          title: "Success",
          description: `${title} added successfully`,
        });
      } else if (dialogMode === DialogMode.Edit && selectedItem) {
        await onUpdate(selectedItem.id, values);
        toast({
          title: "Success",
          description: `${title} updated successfully`,
        });
      }
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || `Failed to ${dialogMode === DialogMode.Add ? 'add' : 'update'} ${title.toLowerCase()}`,
        variant: "destructive",
      });
      // Show validation errors if they exist in the response
      if (error?.errors) {
        for (const field in error.errors) {
          form.setError(field as any, { 
            type: "server", 
            message: error.errors[field] 
          });
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    
    setIsProcessing(true);
    try {
      await onDelete(selectedItem.id);
      toast({
        title: "Success",
        description: `${title} deleted successfully`,
      });
      handleCloseDialog();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || `Failed to delete ${title.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSort = (columnId: string) => {
    if (sorting.column === columnId) {
      // Toggle direction if already sorting by this column
      if (sorting.direction === 'asc') {
        setSorting({ column: columnId, direction: 'desc' });
      } else if (sorting.direction === 'desc') {
        setSorting({ column: null, direction: null }); // Clear sorting
      } else {
        setSorting({ column: columnId, direction: 'asc' });
      }
    } else {
      // Start with ascending sort for new column
      setSorting({ column: columnId, direction: 'asc' });
    }
  };

  // Filter data based on search term
  const filteredData = data.filter(item => {
    if (!searchTerm) return true;
    
    // Search through all fields
    return Object.values(item).some(value => {
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });
  
  // Sort data if needed
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sorting.column || !sorting.direction) return 0;
    
    // Find the column definition
    const column = columns.find(col => col.id === sorting.column);
    if (!column) return 0;
    
    // Get values to compare based on accessorKey
    let aValue: any;
    let bValue: any;
    
    if (typeof column.accessorKey === 'function') {
      aValue = column.accessorKey(a);
      bValue = column.accessorKey(b);
    } else {
      aValue = a[column.accessorKey];
      bValue = b[column.accessorKey];
    }
    
    // Convert to string for comparison if not numbers
    if (typeof aValue !== 'number') aValue = String(aValue).toLowerCase();
    if (typeof bValue !== 'number') bValue = String(bValue).toLowerCase();
    
    // Compare based on direction
    if (sorting.direction === 'asc') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-[200px]"
            />
          </div>
          {onRefresh && (
            <Button variant="outline" size="icon" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={() => handleOpenDialog(DialogMode.Add)}>
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.id}
                  className={column.sortable ? "cursor-pointer select-none" : ""}
                  onClick={column.sortable ? () => handleSort(column.id) : undefined}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable && sorting.column === column.id && (
                      sorting.direction === 'asc' ? 
                        <SortAsc className="h-4 w-4" /> : 
                        <SortDesc className="h-4 w-4" />
                    )}
                  </div>
                </TableHead>
              ))}
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              sortedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell 
                        ? column.cell({ row }) 
                        : typeof column.accessorKey === 'function'
                          ? column.accessorKey(row)
                          : (row[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleOpenDialog(DialogMode.Edit, row)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenDialog(DialogMode.Delete, row)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogMode === DialogMode.Add || dialogMode === DialogMode.Edit} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{dialogMode === DialogMode.Add ? `Add New ${title}` : `Edit ${title}`}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
              {/* Dynamically generate form fields based on schema */}
              {Object.keys(schema.shape).map(key => {
                if (key === 'id') return null; // Skip id field
                
                // Basic field type detection
                const fieldDef = schema.shape[key];
                const isEnum = fieldDef && fieldDef._def && fieldDef._def.typeName === 'ZodEnum';
                const isNumber = fieldDef && fieldDef._def && fieldDef._def.typeName === 'ZodNumber';
                
                // Get enum values if applicable
                const enumValues = isEnum && fieldDef._def.values ? fieldDef._def.values : [];
                
                return (
                  <FormField
                    key={key}
                    control={form.control}
                    name={key}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</FormLabel>
                        <FormControl>
                          {isEnum ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={`Select ${key}`} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {enumValues.map((value: string) => (
                                  <SelectItem key={value} value={value}>
                                    {value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              {...field}
                              type={isNumber ? "number" : "text"}
                              onChange={e => {
                                if (isNumber) {
                                  field.onChange(e.target.value === '' ? '' : Number(e.target.value));
                                } else {
                                  field.onChange(e.target.value);
                                }
                              }}
                              disabled={isProcessing}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isProcessing}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      {dialogMode === DialogMode.Add ? 'Adding...' : 'Updating...'}
                    </>
                  ) : (
                    dialogMode === DialogMode.Add ? 'Add' : 'Update'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={dialogMode === DialogMode.Delete} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCloseDialog} disabled={isProcessing}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmDelete} disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}