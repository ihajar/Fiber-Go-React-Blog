import { Button } from "@/components/ui/button";
import { DialogContent, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import axios from "axios";
import { useState } from "react";



const DeleteBlog = ({
    blogId,
    onDelete,
}: {
  blogId: string,
  onDelete: (blogId: string) => void  
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            const apiUrl = `${import.meta.env.VITE_API_ROOT}/${blogId}`;
            const response = await axios.delete(apiUrl);
            if (response.status === 200) {
                onDelete(blogId);
                setOpen(false);
            }
        } catch (error) {
            console.log("Error deleting blog:", error);
        } finally {
            setLoading(false)
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="destructive">Delete Blog</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <h3>Confirm Deletion</h3>
            </DialogHeader>
            <p>Are you sure you want to delete this blog? This action cannot be undone </p>
            <DialogFooter>
                <Button
                    onClick={() => setOpen(false)}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="destructive"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteBlog