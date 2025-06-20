from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def encode_plot_to_base64():
    buffer = io.BytesIO()
    plt.tight_layout()
    plt.savefig(buffer, format="png")
    plt.close()
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode()

@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    contents = await file.read()

    # Support CSV and Excel
    if file.filename.endswith(".csv"):
        df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    elif file.filename.endswith((".xls", ".xlsx")):
        df = pd.read_excel(io.BytesIO(contents))
    else:
        return {"error": "Unsupported file type. Please upload CSV or Excel."}

    charts = []

    # Chart 1: Correlation heatmap
    plt.figure(figsize=(6, 4))
    sns.heatmap(df.corr(numeric_only=True), annot=True, cmap="coolwarm")
    charts.append(encode_plot_to_base64())

    # Chart 2: Categorical count plot
    cat_cols = df.select_dtypes(include="object").columns
    if len(cat_cols) > 0:
        plt.figure(figsize=(6, 4))
        sns.countplot(data=df, x=cat_cols[0])
        plt.xticks(rotation=45)
        charts.append(encode_plot_to_base64())

        # Chart 3: Pie chart
        plt.figure(figsize=(6, 6))
        df[cat_cols[0]].value_counts().plot.pie(autopct='%1.1f%%')
        plt.ylabel("")
        charts.append(encode_plot_to_base64())

    # Chart 4: Histogram
    num_cols = df.select_dtypes(include="number").columns
    if len(num_cols) > 0:
        plt.figure(figsize=(6, 4))
        sns.histplot(df[num_cols[0]], kde=True)
        charts.append(encode_plot_to_base64())

        # Chart 5: Line plot
        plt.figure(figsize=(6, 4))
        df[num_cols[0]].head(50).plot(kind='line')
        charts.append(encode_plot_to_base64())

    # After generating charts...

    # Basic statistics
    stats = {
        "rows": df.shape[0],
        "columns": df.shape[1],
        "column_names": df.columns.tolist(),
        "data_types": df.dtypes.astype(str).to_dict(),
        "missing_values": df.isnull().sum().to_dict(),
        "summary": df.describe(include='all').to_dict()
    }

    return {"charts": charts, "stats": stats}
