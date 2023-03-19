import { Box, Card, Pagination, TextField, Typography } from "@mui/material";
import { Octokit } from "@octokit/core";
import React, { useEffect, useState } from "react";
import { OctokitOptions } from "@octokit/core/dist-types/types";

type Item = {
  name: string;
  language: string;
  description: string;
};

type Result = {
  total_count: number;
  items: Item[];
};

export type SearchProps = {
  repoWord: string;
  resultPage: number;
};

export default function Search() {
  
  const [repoWord, setRepoWord] = useState<string>("");

  const [repository, setRepository] = useState<Result | null>(null);

  const [resultPage, setResultPage] = useState<number>(1);

  const octokit = new Octokit({
    auth: import.meta.env.VITE_GITHUB_TOKEN,
    throttle: {
      onRateLimit: (
        retryAfter: number,
        options: OctokitOptions,
        octokit: Octokit,
        retryCount: number
      ) => {
        octokit.log.warn(
          `Request quota exhausted for request ${options.method} ${options.url}`
        );

        if (retryCount < 1) {
          octokit.log.info(`Retrying after ${retryAfter} seconds!`);
          return true;
        }
      },
      onSecondaryRateLimit: (
        retryAfter: number,
        options: OctokitOptions,
        octokit: Octokit
      ) => {
        octokit.log.warn(
          `SecondaryRateLimit detected for request ${options.method} ${options.url}`
        );
      },
    },
  });

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setResultPage(value);
  };

  useEffect(() => {
    const searchRepo = async ({ repoWord, resultPage }: SearchProps) => {
      const res = await octokit.request(
        `GET /search/repositories?q=${repoWord}&page=${resultPage}&per_page=4`
      );


      const data = res.data;

      const { total_count, items } = data;

      const repoData: Result = {
        total_count,
        items,
      };

      setRepository(repoData);

  
    };

    searchRepo({ repoWord, resultPage });
  }, [repoWord, resultPage]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "absolute",
          bottom: 0,
          top: 0,
          right: 0,
          left: 0,
          backgroundColor: "lightblue",
        }}
      >
        <TextField
          label="Search Repo"
          sx={{ input: { color: "purple" }, mt: 4 }}
          onChange={(e) => setRepoWord(e.target.value)}
        />

        <Typography sx={{ mt: 2 }}>
          <strong>
            {repository
              ? "Results' number : " + repository.total_count
              : "Please Search"}
          </strong>
        </Typography>
        {repository
          ? repository.total_count > 1000 && (
              <Typography sx={{ mt: 2 }}>
                <strong>Only 1000 are available!</strong>
              </Typography>
            )
          : null}

        <Box sx={{ mt: 3 }}>
          {repository?.items.map((item) => (
            <Card
              sx={{
                display: "flex",
                height: "15vh",
                width: "60vw",
                mb: 2,
                flexDirection: "column",
                backgroundColor: "gold",
                justifyContent: "center",
              }}
            >
              <Typography sx={{ ml: 1 }}>
                <strong>Repo Name : </strong>
                {item.name}
              </Typography>
              <Typography sx={{ ml: 1, mt: 1 }}>
                <strong>Language : </strong>
                {item.language}
              </Typography>
              {item.description && (
                <Typography sx={{ ml: 1, mt: 1 }}>
                  <strong>Description: </strong>
                  {item.description.substring(0, 50)}
                  {item.description.length >= 50 && " ..."}
                </Typography>
              )}
            </Card>
          ))}
        </Box>

        <Pagination
          count={
            repository
              ? repository.total_count >= 1000
                ? 1000 / 4
                : repository.total_count / 4
              : 1
          }
          page={resultPage}
          onChange={handlePageChange}
        />
      </Box>
    </>
  );
}
