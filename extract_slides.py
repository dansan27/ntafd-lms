import os
import sys
import fitz  # PyMuPDF

def extract_pdf_pages_as_images(pdf_path, output_dir):
    """
    Converts each page of a PDF file to a PNG image and saves it to output_dir.
    """
    if not os.path.exists(pdf_path):
        print(f"Error: The file {pdf_path} does not exist.")
        return False
        
    os.makedirs(output_dir, exist_ok=True)
    
    print(f"Opening PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    num_pages = len(doc)
    print(f"Total pages/slides: {num_pages}")
    
    # We use a matrix to scale the output image (DPI).
    # Zoom of 2.0 increases resolution by 2x for high quality (similar to 150-200 DPI).
    zoom = 2.0
    mat = fitz.Matrix(zoom, zoom)
    
    for page_num in range(num_pages):
        page = doc.load_page(page_num)
        pix = page.get_pixmap(matrix=mat)
        
        # Slide numbers starting at 1
        slide_num = page_num + 1
        output_filename = f"slide_{slide_num}.png"
        output_path = os.path.join(output_dir, output_filename)
        
        pix.save(output_path)
        print(f"  Saved slide {slide_num}/{num_pages} -> {output_path}")
        
    print("Extraction completed successfully!")
    return True

if __name__ == "__main__":
    # Default to Semana 9
    week = 9
    pdf_name = "Presentacion_ECNT_Tecnologia.pptx.pdf"
    
    # Allow command line overrides: python extract_slides.py [week_number] [pdf_name]
    if len(sys.argv) > 1:
        try:
            week = int(sys.argv[1])
        except ValueError:
            print("Invalid week number, using default: 9")
            
    if len(sys.argv) > 2:
        pdf_name = sys.argv[2]
        
    # Search in week directory
    week_dir = f"semana {week}"
    pdf_path = os.path.join(week_dir, pdf_name)
    
    # If the file isn't found exactly, search for any PDF inside the week directory
    if not os.path.exists(pdf_path) and os.path.exists(week_dir):
        files = os.listdir(week_dir)
        pdf_files = [f for f in files if f.lower().endswith('.pdf')]
        if pdf_files:
            pdf_path = os.path.join(week_dir, pdf_files[0])
            print(f"Specific file not found, using first PDF in folder: {pdf_path}")
            
    output_dir = os.path.join("public", "images", f"semana {week}")
    
    success = extract_pdf_pages_as_images(pdf_path, output_dir)
    if not success:
        sys.exit(1)
