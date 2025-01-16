import { z } from "zod";
import axios from "axios";
import { useEffect, useState } from "react"
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

const EditBlog = ({ 
    blogId,
    onUpdate 
} : { 
    blogId: string; 
    onUpdate: ( updatedBlog: any ) => void 
}) => {
    const [open, setOpen] = useState(false);

    const form = useForm<BlogFormValues>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            title: "",
            post: "",
        },
    });

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const apiUrl = `${import.meta.env.VITE_API_ROOT}/${blogId}`;
                const response = await axios.get(apiUrl);

                if (response.status === 200) {
                    const {title, post} = response.data.record;
                    form.reset({ title, post })
                }
            } catch (error) {
                console.error("Error fetching blog:", error);
            }
        };
        if (open) {
            fetchBlogData();
        }
    }, [blogId, form, open]);

    const onSubmit = async (values: BlogFormValues) => {
        try {
            const apiUrl = `${import.meta.env.VITE_API_ROOT}/${blogId}`;
            const response = await axios.put(apiUrl, values);

            if (response.status === 200) {
                const updatedBlog = response.data.data;
                console.log("Updated Blog Data:", updatedBlog);
                
                onUpdate(updatedBlog);
                setOpen(false);
            }
        } catch (error) {
            console.error("Error updating blog:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="default">Edit Blog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit blog</DialogTitle>
                    <DialogDescription>Update the details of your blog post.</DialogDescription>
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
                                        <Input {...field} />
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
                                    <Textarea  {...field} />
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
                            {form.formState.isSubmitting ? "Saving..." : "Save changes"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default EditBlog