/**
 * Copyright (c) 2014-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */
import type {GlobalConfig} from 'types/Config';
import {BaseWatchPlugin, Prompt} from 'jest-watcher';
import ProjectNamePatternPrompt from '../project_name_pattern_prompt';
import activeFilters from '../lib/active_filters_message';

class ProjectNamePatternPlugin extends BaseWatchPlugin {
  _prompt: Prompt;
  isInternal: true;

  constructor(options: {
    stdin: stream$Readable | tty$ReadStream,
    stdout: stream$Writable | tty$WriteStream,
  }) {
    super(options);
    this._prompt = new Prompt();
    this.isInternal = true;
  }

  getUsageInfo() {
    return {
      key: 'r',
      prompt: 'filter by a project display name regex pattern',
    };
  }

  onKey(key: string) {
    this._prompt.put(key);
  }

  run(globalConfig: GlobalConfig, updateConfigAndRun: Function): Promise<void> {
    return new Promise((res, rej) => {
      const projectNamePatternPrompt = new ProjectNamePatternPrompt(
        this._stdout,
        this._prompt,
      );

      projectNamePatternPrompt.run(
        (value: string) => {
          updateConfigAndRun({mode: 'watch', projectNamePattern: value});
          res();
        },
        rej,
        {
          header: activeFilters(globalConfig),
        },
      );
    });
  }
}

export default ProjectNamePatternPlugin;
