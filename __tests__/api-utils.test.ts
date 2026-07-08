import {jest, describe, it, expect, beforeEach, afterEach} from '@jest/globals';
import * as github from '@actions/github';
import * as apiUtils from '../src/api-utils.js';

import prereleaseData from './data/pre-release.json' with {type: 'json'};
import releaseData from './data/release.json' with {type: 'json'};

const token = 'faketoken';
const octokitClient = github.getOctokit(token);

type GetReleaseByTagResponse = Awaited<
  ReturnType<typeof octokitClient.rest.repos.getReleaseByTag>
>;

let getReleaseSpy: jest.SpiedFunction<
  typeof octokitClient.rest.repos.getReleaseByTag
>;

process.env.GITHUB_REPOSITORY = 'test/repository';

describe('validateIfReleaseIsPublished', () => {
  beforeEach(() => {
    getReleaseSpy = jest.spyOn(octokitClient.rest.repos, 'getReleaseByTag');
  });

  it('throw if release is marked as pre-release', async () => {
    getReleaseSpy.mockResolvedValue(prereleaseData as GetReleaseByTagResponse);

    expect.assertions(1);
    await expect(
      apiUtils.validateIfReleaseIsPublished('v1.0.0', octokitClient)
    ).rejects.toThrow(
      "The 'v1.0.0' release is marked as pre-release. Updating tags for pre-release is not supported"
    );
  });

  it('validate that release is published', async () => {
    getReleaseSpy.mockResolvedValue(releaseData as GetReleaseByTagResponse);

    expect.assertions(1);
    await expect(
      apiUtils.validateIfReleaseIsPublished('v1.1.0', octokitClient)
    ).resolves.not.toThrow();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });
});
