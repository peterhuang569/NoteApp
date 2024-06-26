'use client';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { FileQuestionIcon, FlagIcon, NewspaperIcon, TagIcon, HeartIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PDFViewer from "@/components/pdf";
import Nav from '@/components/nav';
import { useState, useEffect } from "react";

interface FileData {
  fileName: string;
}

const PlaceholderCard = () => (
  <Card className="w-full max-w-[300px] h-[200px] flex flex-col bg-gray-200 rounded-lg overflow-hidden shadow-md">
    <CardContent className="flex-1 p-4">
      <div className="animate-pulse h-full">
        <div className="h-8 bg-gray-300 mb-2"></div>
        <div className="h-6 bg-gray-300 mb-2"></div>
        <div className="h-4 bg-gray-300 mb-2"></div>
        <div className="h-4 bg-gray-300"></div>
      </div>
    </CardContent>
  </Card>
);

export default function Home() {
  const [fid, setFid] = useState('');
  const [cid, setCid] = useState('');
  const [uid, setUid] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<FileData[]>([]);

  useEffect(() => {
    // Parse URL on the client side
    const pathArray = window.location.pathname.split('/');
    const cidFromPath = pathArray[pathArray.length - 3];
    const uidFromPath = pathArray[pathArray.length - 5];
    const fidFromPath = pathArray[pathArray.length - 1];
    setFid(fidFromPath);
    setUid(uidFromPath);
    setCid(cidFromPath);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        const res = await fetch(`https://pdfstoragefunctionapp.azurewebsites.net/api/RetrievePDF?code=Gu8Q0bfstlXK8Tf_w5xVXJt-Ll0zuBubcNkR-6BA6U9jAzFuJ6KgIw%3D%3D&fid=${encodeURIComponent(fid)}`);
        const data: FileData[] = await res.json();
        setFile(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching file:', error);
        setLoading(true);
      }
    };

    if (fid) {
      fetchData();
    }
  }, [fid]);

  if (loading) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <>
      <Nav page_name={'notes'}></Nav>

      <div className="border-lg bg-secondary text-secondary-foreground hover:bg-white my-1 py-4 shadow-sm dark:bg-gray-900 dark:text-white dark:hover:bg-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            {file.length > 0 && (
              <h1 className="scroll-m-20 text-4xl tracking-tight lg:text-5xl my-6">
                {file[0].fileName}
              </h1>
            )}

            <Breadcrumb>
              <BreadcrumbList className="flex items-center space-x-4 text-2xl">
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/university/${uid}`}>
                    University
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/university/${uid}/course/${cid}`}>
                    Course
                  </BreadcrumbLink>
                </BreadcrumbItem>
                
                <BreadcrumbSeparator />
                
                <BreadcrumbItem>
                  <BreadcrumbPage>Date</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <div className="flex space-x-4 mt-4">
              <Badge variant="outline" className="bg-blue-100 text-blue-800 text-lg px-4 py-2"><NewspaperIcon/>Upvoted</Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800 text-lg px-4 py-2"><FileQuestionIcon/>Popular</Badge>
              <Badge variant="outline" className="bg-red-100 text-red-800 text-lg px-4 py-2"><TagIcon/>Featured</Badge>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 text-lg px-4 py-2"><FlagIcon/>New</Badge>
            </div>
          </div>

          <div className="flex items-center space-x-4 ">
            <Button variant="outline" className="ml-4"><FlagIcon/></Button>
            <Button variant="default" className="flex items-center px-4 py-2 hover:bg-primary/80">
              <HeartIcon className="mr-2" />
              <span className="text-sm">Favorite</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex">
        {/* <Card className="w-[300px] h-auto flex flex-col shadow-lg">
          <CardHeader>
            <CardTitle>Similar Content</CardTitle>
            <CardDescription>showing notes with similar Keywords</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
            <PlaceholderCard />
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button variant="outline" className="text-base md:text-lg lg:text-xl">View More</Button>
          </CardFooter>
        </Card> */}

        {file.length > 0 && (
          <div className="ml-20 w-3/4 h-[800px] shadow-lg overflow-auto">
            <PDFViewer pdfUrl={`https://dricandpeter.blob.core.windows.net/pdfblob/${encodeURIComponent(file[0].fileName)}`} />
          </div>
        )}
      </div>
      <footer className="bg-secondary text-black py-6 dark:text-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p>&copy; 2024 NoteHub. All rights reserved.</p>
            <div className="space-x-4">
              <a href="/privacy-policy" className="hover:underline">Privacy Policy</a>
              <a href="/terms-of-service" className="hover:underline">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
