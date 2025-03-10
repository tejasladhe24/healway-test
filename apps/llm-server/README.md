# llm-server

This is a basic FastAPI server named **llm-server**. It provides a single POST request endpoint to summarize content sent in the request body.

## Endpoint

### POST /api/summarize/with-text

This endpoint accepts a JSON payload with the content to be summarized.

#### Request Body

```json
{
  "text": "Your content to be summarized here."
}
```

#### Response

```json
{
  "summary": "The summarized content."
}
```

## Setup

To set up the project, ensure you have the necessary dependencies installed. The `project.toml` file is present in the root directory, so you can install the dependencies using:

```bash
poetry install
```

## Running the Server

To run the FastAPI server, use the following command:

```bash
uvicorn main:app --reload
```

This will start the server on `http://127.0.0.1:8000`.

## License

This project is licensed under the MIT License.
