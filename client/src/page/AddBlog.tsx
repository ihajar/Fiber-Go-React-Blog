import { z } from "zod";
import axios from "axios";
import { useState } from "react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";



// Zod schema for form validation
const blogSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title must be under 100 characters"),
    post: z.string().min(1, "Post is required").max(5000, "Post content is too long"),
});

type BlogFormValues = z.infer<typeof blogSchema>;

const AddBlog = ({ onAdd } : { onAdd: ( newBlog: any ) => void }) => {
    const [open, setOpen] = useState(false);

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            post: "",
        },
    });

    const onSubmit = async (values: BlogFormValues) => {
        try {
            const apiUrl = import.meta.env.VITE_API_ROOT;
            const response = await axios.post(apiUrl, values);

            if (response.status === 201) {
                onAdd(response.data.data);
                form.reset();
                console.log("API Response:", response);
                setOpen(false);
            }
        } catch (error) {
            console.error("Error adding blog:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Add Blog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a new blog</DialogTitle>
                    <DialogDescription>Fill in the details to create a new blog post.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter blog title" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="post"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Post</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Write your blog content here..." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            variant="default"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Adding..." : "Add Blog"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default AddBlog